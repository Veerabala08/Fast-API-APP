from fastapi import FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.params import Depends
from models import Product, UserCreate, UserLogin
from database import SessionLocal, engine
import database_models, models
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from auth_utils import hash_password, verify_password, create_access_token
from dotenv import load_dotenv
import os
load_dotenv()
VITE_PORT = os.getenv("VITE_PORT", "http://localhost:5173")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# create FastAPI instance
app = FastAPI()

origins = [
    VITE_PORT, 
    # Vite default dev port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ensure all tables are created from sqlalchemy models
database_models.Base.metadata.create_all(bind=engine)

# Prepopulate database with some products
products = [
    Product(id=1, name="Laptop", price=999.99, quantity=10),
    Product(id=2, name="Smartphone", price=499.99, quantity=20),
    Product(id=3, name="Tablet", price=299.99, quantity=15),
]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    db = SessionLocal()
    count = db.query(database_models.Product).count()
    if count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit() 
init_db()

@app.post("/register")
def register_user(user: models.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(database_models.User).filter(database_models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    print(f"Password received: {user.password!r}")
    print(f"Password length: {len(user.password.encode('utf-8'))} bytes")
    hashed_pw = hash_password(user.password)
    new_user = database_models.User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.post("/token")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(database_models.User).filter(database_models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, "super_secret_key_change_this", algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(database_models.User).filter(database_models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user



@app.get("/")
def greet():
    return {"message": "Hello, World!"}

@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    db_products = db.query(database_models.Product).all()
    return db_products

@app.get("/product/{product_id}")
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if db_product:
        return db_product
    return "product not found"

@app.post("/product")
def add_product(new_product: Product, db: Session = Depends(get_db)):
    db.add(database_models.Product(**new_product.model_dump()))
    db.commit()
    return new_product

@app.put("/product/{product_id}")
def update_product(product_id: int, updated_product: Product, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if db_product:
        db_product.name = updated_product.name
        db_product.price = updated_product.price
        db_product.quantity = updated_product.quantity
        db.commit()
        return updated_product
    else:
        return "not found"

@app.delete("/product/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return "deleted"
    else:
        return "not found"