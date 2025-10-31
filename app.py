from fastapi import FastAPI
from fastapi.params import Depends
from models import Product
from database import session, engine
import database_models
from sqlalchemy.orm import Session

# create FastAPI instance
app = FastAPI()

# ensure all tables are created from sqlalchemy models
database_models.Base.metadata.create_all(bind=engine)

@app.get("/")
def greet():
    return {"message": "Hello, World!"}

# Prepopulate database with some products
products = [
    Product(id=1, name="Laptop", price=999.99, quantity=10),
    Product(id=2, name="Smartphone", price=499.99, quantity=20),
    Product(id=3, name="Tablet", price=299.99, quantity=15),
]

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

def init_db():
    db = session()
    count = db.query(database_models.Product).count()
    if count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit()
    
init_db()

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