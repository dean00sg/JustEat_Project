from typing import Any, Optional
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, LargeBinary, JSON, String
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from deps import Base

class FeedPost(Base):
    __tablename__ = 'Feedpost'

    NT_id = Column(Integer, primary_key=True, index=True)
    header = Column(String, nullable=False)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    image_url = Column(String, nullable=True)
    description = Column(JSON, nullable=True)
    record_date = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))

class LogFeedPost(Base):
    __tablename__ = 'log_feedpost'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    action_name = Column(String, nullable=False)
    action_byname = Column(String, nullable=False)
    action_datetime = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))
    NT_id = Column(Integer, nullable=False)

    header = Column(String, nullable=False)
    to_header = Column(String, nullable=True)
    start_datetime = Column(DateTime, nullable=False)
    to_start_datetime = Column(DateTime, nullable=True)

    end_datetime = Column(DateTime, nullable=False)
    to_end_datetime = Column(DateTime, nullable=True)

    image_url = Column(String, nullable=True)
    to_image_url = Column(String, nullable=True)

    description = Column(JSON, nullable=True)
    to_description = Column(JSON, nullable=True)

    record_date = Column(DateTime, nullable=False)
    to_record_date = Column(DateTime, nullable=True)

class FeedPostCreate(BaseModel):
    header: str
    start_datetime: datetime
    end_datetime: datetime
    image_url: Optional[str] = None
    description: Optional[Any] = None

class FeedPostUpdate(BaseModel):
    header: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    image_url: Optional[str] = None
    description: Optional[Any] = None

class FeedPostResponse(BaseModel):
    status: str
    NT_id: int
    header: str
    start_datetime: datetime
    end_datetime: datetime
    image_url: Optional[str] = None
    description: Optional[Any] = None
    record_date: datetime

    class Config:
        orm_mode = True
