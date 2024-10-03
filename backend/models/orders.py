from datetime import datetime
from pydantic import BaseModel, Field
from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from deps import Base
from typing import List

class OrdersFood(Base):
    __tablename__ = "OrdersFood"

    orders_id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey('Menu.menu_id'), nullable=False) 
    name_menu = Column(String, index=False)
    qty = Column(Integer, nullable=False)
    image = Column(String, nullable=False)
    Option_id = Column(String, nullable=True)  # Store as a string for multiple options
    option_name = Column(String, nullable=True)  # Store as a string
    category_id = Column(Integer, ForeignKey('Category.category_id'), nullable=False)
    category_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    remark = Column(String, nullable=True)  
    total_price = Column(Float, nullable=False)

    # Status fields without foreign keys to non-unique columns
    status_option = Column(String, nullable=False)  # Keep as a simple string
    status_menu = Column(String, nullable=False)    # Keep as a simple string
    status_order = Column(String, nullable=False)
    status_working = Column(String, default="inprogress")

    @property
    def option_name_list(self):
        return self.option_name.split(',') if self.option_name else []

# Pydantic Models
class CreateOrders(BaseModel):
    menu_id: int
    qty: int
    option_ids: List[int]
    category_id: int
    remark: str

class ResponseOrders(BaseModel):
    orders_id: int
    name_menu: str
    qty: int
    image: str
    option_name: List[str]  # Should be a list
    category_name: str
    price: float  # Change to float
    remark: str
    total_price: float  # Change to float
    status_option: str
    status_menu: str
    status_order: str
    status_working: str


class Createupdateremark(BaseModel):
    
    remark: str

class Createupdateworking(BaseModel):

    status_working: str