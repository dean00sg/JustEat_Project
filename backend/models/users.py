from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from deps import Base
from typing import List, Optional

class UserProfile(Base):
    __tablename__ = 'Userprofiles'

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default="user")  
    



class LogUserProfile(Base):
    __tablename__ = 'log_Userprofiles'

    id = Column(Integer, primary_key=True, index=True)
    action_name = Column(String)
    action_datetime = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))
    user_id = Column(Integer)

    username = Column(String)
    to_username = Column(String)
  

    email = Column(String)
    to_email = Column(String)

    password = Column(String)
    to_password = Column(String)

    role = Column(String, default="user")
   

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = Field(default="user")

class UserUpdate(BaseModel):
    username: Optional[str] = None  
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None  



class DeleteResponse(BaseModel):
    status: str
    id: int
    username: str
    email: EmailStr
    role: str
    class Config:
        orm_mode = True 

class Login(BaseModel):
    username: str
    password: str
    class Config:
        orm_mode = True 

class UpdateUser(BaseModel):
    username: Optional[str] = None
    email: EmailStr
    new_password: Optional[str] = None
    class Config:
        orm_mode = True 

class UpdateUserResponse(BaseModel):
    status: str
    user_id: int
    username: str
    email: EmailStr

    role: str

    class Config:
        orm_mode = True

class GetUserProfile(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True 
        

class UserAuthen(BaseModel):
    user_id: int
    username: str   
    email: EmailStr
   
    
    class Config:
        orm_mode = True  