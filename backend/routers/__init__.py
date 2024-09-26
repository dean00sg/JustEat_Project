from fastapi import FastAPI
from .users import router as auth_router
from .feedpost import router as feedpost_router
from .category import router as category_router
from .option import router as option_router

def init_router(app: FastAPI):
    app.include_router(auth_router, prefix="/authentication")
    app.include_router(feedpost_router, prefix="/feedpost")
    app.include_router(category_router, prefix="/category")
    app.include_router(option_router, prefix="/option")
  
