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
    name = Column(String, index=True)
    image = Column(String, nullable=True)
    option_name = Column(String, nullable=True)
    category_name = Column(String, nullable=True)
    price = Column(String, nullable=True)
    remark = Column(String, nullable=True)  
    create_by = Column(String, index=True) 




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
    option_name =Column(String, nullable=False)
    to_option_name =Column(String, nullable=True)

    # status = Column(String, nullable=False)
    create_by = Column(String, nullable=False)



class MenuCreate(BaseModel):
    name: str
    image: str
    option_name: str
    category_name: str
    price: str
    remark: str


class MenuUpdate(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    option_name: Optional[str] = None
    category_name: Optional[str] = None
    price: Optional[str] = None
    remark: Optional[str] = None


class MenuResponse(BaseModel):
    menu_id: int
    name: str
    image: str
    option_name: str
    category_name: str
    price: str
    remark: str  # Ensure remark is included as required
    create_by: str

    class Config:
        orm_mode = True