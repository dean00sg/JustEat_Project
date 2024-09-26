from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, String
from deps import Base



class Promotion(Base):
    __tablename__ = 'Promotion'

    promotion_id = Column(Integer, primary_key=True, index=True)
    datetime_rec = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))
    header = Column(String, nullable=False)
    startdatetime = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))
    enddatetime = Column(DateTime, nullable=False)
    image = Column(String, nullable=False)
    description = Column(String, nullable=False)
    create_by = Column(String, nullable=False)



class LogPromotion(Base):
    __tablename__ = 'log_Promotion'

    id = Column(Integer, primary_key=True, index=True)
    promotion_id = Column(Integer, nullable=False)
    action_name = Column(String, nullable=False)
    action_datetime = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))
    action_by = Column(String, nullable=False)

    datetime_rec = Column(DateTime, nullable=False)
    header = Column(String, nullable=False)
    to_header = Column(String, nullable=True)
    startdatetime = Column(DateTime, nullable=False)
    enddatetime = Column(DateTime, nullable=False)
    to_enddatetime = Column(DateTime, nullable=True)
    image = Column(String, nullable=False)
    to_image = Column(String, nullable=True)
    description = Column(String, nullable=False)
    to_description = Column(String, nullable=True)
    create_by = Column(String, nullable=False)




class MenuCreate(BaseModel):
    header: str
    image: str
    description: str
    enddatetime:datetime
   


class MenuUpdate(BaseModel):
    header: Optional[str] = None
    image: Optional[str] = None
    enddatetime: Optional[datetime] = None
    description: Optional[str] = None
  


class MenuResponse(BaseModel):
    promotion_id: int
    header: str
    image: str
    description: str
    startdatetime: datetime
    enddatetime: datetime
    remark: str = "No remarks"  # Set a default value
    create_by: str

    class Config:
        orm_mode = True
