from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    bio = Column(String, default="") 

    links = relationship("Link", back_populates="user")
    settings = relationship("Settings", back_populates="user", uselist=False)


class Link(Base):

    __tablename__ = "links"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))

    user = relationship("User", back_populates="links")

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True)
    theme = Column(String, default="ocean")
    color_palette = Column(String, default="indigo-500")
    layout = Column(String, default="list")
    featured_links = Column(String, default="[]")  # JSON string
    show_icons = Column(Boolean, default=True)
    button_shape = Column(String, default="rounded")  
    button_style = Column(String, default="solid")   
    background_effect = Column(String, default="gradient")  
    font_family = Column(String, default="Inter")

    user = relationship("User", back_populates="settings")

