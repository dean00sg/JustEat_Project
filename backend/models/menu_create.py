from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from deps import Base
from typing import List, Optional



from sqlalchemy import Column, Integer, String

class Menu(Base):
    __tablename__ = "Menu"

    menu_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=False)
    image = Column(String, nullable=False)
    
    category_id = Column(Integer, ForeignKey('Category.category_id'), nullable=False)
    category_name = Column(String, nullable=False)
    price = Column(String, nullable=False)
    status_menu = Column(String, default="available")
    remark = Column(String, nullable=True)  
    create_by = Column(String, index=False)




class LogMenu(Base):
    __tablename__ = 'log_Menu'

    id = Column(Integer, primary_key=True, index=True)
    action_name = Column(String)
    action_datetime = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))
    action_by = Column(String, nullable=False)
    
    menu_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    to_name = Column(String, nullable=True)
    image = Column(String, nullable=False)
    to_image = Column(String, nullable=True)
    price = Column(String, nullable=False)
    to_price = Column(String, nullable=True)
    category_name =Column(String, nullable=False)
    to_category_name =Column(String, nullable=True)
  
    # status = Column(String, nullable=False)
    create_by = Column(String, nullable=False)



class MenuCreate(BaseModel):
    name: str
    image: str
    category_id: int
    price: str
    remark: str


class MenuUpdate(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[str] = None
    status_menu: Optional[str] = None
    remark: Optional[str] = None


class MenuResponse(BaseModel):
    menu_id: int
    name: str
    image: str
    category_name: str
    price: str
    remark: str 
    status_menu:str
    create_by: str

    class Config:
        orm_mode = True