from fastapi import FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.params import Depends
from models import UserCreate, UserLogin, SettingsModel, PublicSettings
from database import SessionLocal, engine
import database_models, models
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from auth_utils import hash_password, verify_password, create_access_token, user_authentication
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    auth_data = user_authentication(token, db)
    return auth_data["user"]

@app.post("/links", response_model=models.Link)
def create_link(link: models.LinkCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    auth_data = user_authentication(token, db)
    user = auth_data["user"]
    
    new_link = database_models.Link(title=link.title, url=link.url, user_id=user.id)
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return new_link

@app.put("/links/{link_id}", response_model=models.Link)
def update_link(
    link_id: int,
    link: models.LinkCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    auth_data = user_authentication(token, db)
    user = auth_data["user"]

    db_link = db.query(database_models.Link).filter(
        database_models.Link.id == link_id,
        database_models.Link.user_id == user.id
    ).first()

    if not db_link:
        raise HTTPException(status_code=404, detail="Link not found")

    db_link.title = link.title
    db_link.url = link.url
    db.commit()
    db.refresh(db_link)
    return db_link

# Update the delete_link function

@app.delete("/links/{link_id}")
def delete_link(
    link_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    auth_data = user_authentication(token, db)
    user = auth_data["user"]

    db_link = db.query(database_models.Link).filter(
        database_models.Link.id == link_id,
        database_models.Link.user_id == user.id
    ).first()

    if not db_link:
        raise HTTPException(status_code=404, detail="Link not found")

    db.delete(db_link)
    db.commit()
    return {"message": "Link deleted successfully"}


@app.get("/links/me", response_model=list[models.Link])
def get_my_links(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    auth_data = user_authentication(token, db)
    user = auth_data["user"]

    return db.query(database_models.Link).filter(database_models.Link.user_id == user.id).all()

@app.get("/profile/{username}", response_model=dict)
def public_profile(username: str, db: Session = Depends(get_db)):
    
    user = db.query(database_models.User).filter(database_models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    links = db.query(database_models.Link).filter(database_models.Link.user_id == user.id).all()
    return {
    "full_name": user.full_name,
    "links": [{"id": l.id, "title": l.title, "url": l.url} for l in links]
  }


@app.get("/settings/me", response_model=models.SettingsModel)
def get_my_settings(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Fetch the settings for the currently authenticated user.
    If the user doesn't have settings yet, create default settings.
    """
    auth_data = user_authentication(token, db)
    user = auth_data["user"]

    settings = db.query(database_models.Settings).filter(database_models.Settings.user_id == user.id).first()

    # If settings don't exist yet, create them with defaults
    if not settings:
        settings = database_models.Settings(user_id=user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings

# Update the update_settings function
@app.patch("/settings", response_model=models.SettingsModel)
def update_settings(settings_data: dict, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Update the current user's settings.
    """
    auth_data = user_authentication(token, db)
    user = auth_data["user"]

    settings = db.query(database_models.Settings).filter(database_models.Settings.user_id == user.id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")

    # Update settings fields safely
    for key, value in settings_data.items():
        if hasattr(settings, key):
            setattr(settings, key, value)

    db.commit()
    db.refresh(settings)
    return settings

@app.get("/profile/{username}", response_model=dict)
def public_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(database_models.User).filter(database_models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    links = db.query(database_models.Link).filter(database_models.Link.user_id == user.id).all()
    settings = db.query(database_models.Settings).filter(database_models.Settings.user_id == user.id).first()

    return {
        "full_name": user.full_name,
        "bio": user.bio,
        "links": [{"id": l.id, "title": l.title, "url": l.url} for l in links],
        "settings": {
            "theme": settings.theme if settings else "ocean",
            "layout": settings.layout if settings else "list",
            "show_icons": settings.show_icons if settings else True,
            "background_effect": settings.background_effect if settings else "gradient",
            "font_family": settings.font_family if settings else "Inter",
            "button_shape": settings.button_shape if settings else "rounded",
            "button_style": settings.button_style if settings else "solid"
        }
    }
