from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from deps import init_db, SessionLocal, get_current_user
from routers import init_router
from security import AuthHandler,Token
from models.users import UserProfile  
from pydantic import BaseModel

app = FastAPI()
auth_handler = AuthHandler()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


init_db()
init_router(app)

@app.get("/")
def root():
    return {"message": "Welcome to the Pet Care App"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(UserProfile).filter(UserProfile.email == form_data.username).first()

    
    if not user or not auth_handler.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
  
    access_token = auth_handler.create_access_token(data={"username": user.email, "role": user.role})
    

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/protected-route")
async def protected_route(user: str = Depends(get_current_user)):
    return {"message": f"Hello, {user}"}
