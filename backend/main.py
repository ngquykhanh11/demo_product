import os
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Any, Callable, Dict, Optional
from pydantic import BaseModel
from schemas import LoginRequest

from sqlmodel import Session, select, SQLModel, Field

from model import User, Product, ProductCreate, ProductBase, User
from sql_engine import engine 

app = FastAPI()
api_router = APIRouter(prefix="/api")


def get_session():
    with Session(engine) as session:
        yield session
# the login part tho
@api_router.post("/login")
def login(data: LoginRequest, session: Session = Depends(get_session)):
    username = str(data.username).strip()
    password = str(data.password).strip()

    user = session.exec(select(User).where(User.username == username)).first()

    if user:
        
        if user.password_hash != password:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        return {"message": "Login successful", "user_id": user.id}
    
    # the lazy thing to do is to create a new user
    new_user = User(username=username, password_hash=password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "Account created and logged in", "user_id": new_user.id}

# create product 
@api_router.post("/create")
async def create_product(product: ProductBase):
    try:
        db_product = Product(**product.dict())
        with Session(engine) as session:
            session.add(db_product)
            session.commit()
            session.refresh(db_product)
        return {"message": "Product created successfully", "product": db_product.model_dump()}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# get all the products tho
@api_router.get("/products")
async def read_all_products(limit: int | None = None):
    try:
        with Session(engine) as session:
            statement = select(Product)
            if limit:
                statement = statement.limit(limit)
            products = session.exec(statement).all()
            return {"message": "Products retrieved", "content": [prod.model_dump() for prod in products]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get product by id
@api_router.get("/products/{id}")
async def get_product_by_id(id: int):
    try:
        with Session(engine) as session:
            product = session.get(Product, id)
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            return {"message": "Product found", "content": product.model_dump()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@api_router.get("/my-products/{username}")
def get_my_products(username: str, session: Session = Depends(get_session)):
    products = session.exec(select(Product).where(Product.creator == username)).all()
    return {"content": products}


# delete them
@api_router.delete("/product/{id}")
async def remove_product(id: int):
    try:
        with Session(engine) as session:
            product = session.get(Product, id)
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            session.delete(product)
            session.commit()
            return {"message": "Product deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# update product by id
@api_router.patch("/product/{id}")
async def update_product(id: int, column: str, new_value: str):
    try:
        with Session(engine) as session:
            product = session.get(Product, id)
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            if not hasattr(product, column):
                raise HTTPException(status_code=400, detail=f"Column '{column}' does not exist")
            current_value = getattr(product, column)
            try:
                if isinstance(current_value, int):
                    converted_value = int(new_value)
                elif isinstance(current_value, float):
                    converted_value = float(new_value)
                elif isinstance(current_value, bool):
                    converted_value = new_value.lower() in ("true", "1", "yes")
                else:
                    converted_value = new_value
                setattr(product, column, converted_value)
                session.add(product)
                session.commit()
                return {"message": "Product updated successfully", "product_id": id}
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Cannot convert '{new_value}' to required type")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


# DO NOT TOUCH ANYTHING BELOW THIS LINE.



SQLModel.metadata.create_all(engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)

# Serve static frontend (build React)
frontend_build_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/build"))
# app.mount("/static", StaticFiles(directory=os.path.join(frontend_build_dir, "static")), name="static")

# Replace the existing static mount with this:
app.mount("/static", StaticFiles(directory=os.path.join(frontend_build_dir, "static")), name="static")

@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(frontend_build_dir, "index.html"))


@app.get("/{full_path:path}")
async def spa_fallback(full_path: str):
    file_location = os.path.join(frontend_build_dir, full_path)
    if os.path.exists(file_location) and os.path.isfile(file_location):
        return FileResponse(file_location)
    # Fallback to index.html for SPA routing
    return FileResponse(os.path.join(frontend_build_dir, "index.html"))