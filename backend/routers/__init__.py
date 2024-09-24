from fastapi import FastAPI
from .users import router as auth_router
from .feedpost import router as feedpost_router

def init_router(app: FastAPI):
    app.include_router(auth_router, prefix="/authentication")
    app.include_router(feedpost_router, prefix="/feedpost")
  
