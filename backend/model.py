from typing import Optional
from sqlmodel import SQLModel, Field

class ProductBase(SQLModel):
    name: str
    price: float
    currency: str
    img: str = ""
    description: str = ""
    category: str = ""
    quantity: int
    assetType: str
    owner: str = ""
    tradeable: bool = True
    tokenId: str = ""
    contractAddress: str = ""
    creator: str = ""
    
class ProductCreate(ProductBase):
    pass

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str

  
    

