from fastapi import FastAPI
from .users import router as auth_router

def init_router(app: FastAPI):
    app.include_router(auth_router, prefix="/authentication")
  
