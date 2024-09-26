# models/category.py
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, String
from deps import Base
from typing import Optional


class Category(Base):
    __tablename__ = 'Category'

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, nullable=False)
    remark = Column(String, nullable=False)
    created_by = Column(String, nullable=False)
    datetime_rec = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))


class LogCategory(Base):
    __tablename__ = 'log_Category'

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, nullable=False)
    action_name = Column(String, nullable=False)
    action_datetime = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))
    action_by = Column(String, nullable=False)
    datetime_rec = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))
    to_datetime_rec = Column(DateTime, nullable=True)
    category_name = Column(String, nullable=False)
    to_category_name = Column(String, nullable=True)
    remark = Column(String, nullable=False)
    to_remark = Column(String, nullable=True)
    created_by = Column(String, nullable=False)


class CategoryCreate(BaseModel):
    category_name: str
    remark: str


class CategoryUpdate(BaseModel):
    category_name: Optional[str] = None
    remark: Optional[str] = None


class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    remark: str
    created_by: str

    class Config:
        orm_mode = True

