from pydantic import BaseModel, EmailStr

class Product(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    username: str
    password: str

