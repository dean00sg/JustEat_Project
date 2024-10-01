from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from deps import Base

class Option(Base):
    __tablename__ = 'Option'

    Option_id = Column(Integer, primary_key=True, index=True)
    datetime_rec = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))
    option_name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('Category.category_id'), nullable=False)
    category_name = Column(String, nullable=False)
    price = Column(String, nullable=False)
    remark = Column(String, nullable=True)
    status_option = Column(String, default="available")  # Fixed typo: "avalable" to "available"
    created_by = Column(String, nullable=False)


class LogOption(Base):
    __tablename__ = 'log_Option'

    id = Column(Integer, primary_key=True, index=True)
    Option_id = Column(Integer, nullable=False)
    action_name = Column(String, nullable=False)
    action_datetime = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))
    action_by = Column(String, nullable=False)

    datetime_rec = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))
    option_name = Column(String, nullable=False)
    to_option_name = Column(String, nullable=True)
    category_name = Column(String, nullable=False)
    to_category_name = Column(String, nullable=True)
    price = Column(String, nullable=False)
    to_price = Column(String, nullable=True)
    remark = Column(String, nullable=False)
    to_remark = Column(String, nullable=True)
    created_by = Column(String, nullable=False)


class OptionCreate(BaseModel):
    option_name: str
    category_id: int
    price: str
    remark: Optional[str] = None 
    status_option: Optional[str] = "available" 


class OptionUpdate(BaseModel):
    option_name: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[str] = None
    remark: Optional[str] = None
    status_option: Optional[str] = None


class OptionResponse(BaseModel):
    Option_id: int
    option_name: str
    category_name: str
    price: str
    remark: Optional[str] = None
    status_option: str

    class Config:
        orm_mode = True
