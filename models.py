from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    username: str
    password: str

class LinkBase(BaseModel):
    title: str
    url: str

class LinkCreate(LinkBase):
    pass

class Link(LinkBase):
    id: int
    user_id: int

    class Config:
        from_attributes  = True

class SettingsBase(BaseModel):
    theme: Optional[str] = "ocean"
    color_palette: Optional[str] = "indigo-500"
    layout: Optional[str] = "list"
    featured_links: Optional[str] = "[]"
    show_icons: Optional[bool] = True

class SettingsModel(BaseModel):
    theme: str
    layout: str
    show_icons: bool
    color_palette: Optional[str] = "indigo-500"
    featured_links: Optional[str] = "[]"
    button_shape: Optional[str] = "rounded"
    button_style: Optional[str] = "solid"
    background_effect: Optional[str] = "gradient"
    font_family: Optional[str] = "Inter"

    class Config:
        from_attributes = True

class PublicSettings(BaseModel):
    theme: str
    layout: str
    show_icons: bool
    background_effect: str
    font_family: str
    button_shape: str
    button_style: str