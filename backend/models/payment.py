from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from deps import Base

class Payment(Base):
    __tablename__ = 'Payment'

    pay_id = Column(Integer, primary_key=True, index=True)
    orders_id =Column(Integer, ForeignKey('OrdersFood.orders_id'), nullable=False) 
    total_price = Column(Integer, nullable=False) 
    datetime_rec = Column(DateTime, nullable=False, default=lambda: datetime.now().replace(microsecond=0))

    status_payment= Column(String, default="Pending" ,nullable=False)
    datetime_pay = Column(DateTime, nullable=False)
    create_by = Column(String, nullable=False)
    checkpay_by = Column(String, nullable=False)



class PaymentCreate(BaseModel):
    orders_id :int


class PaymentUpdate(BaseModel):
    orders_id :int
    datetime_pay:datetime
    status_payment:str
    checkpay_by:str



class PaymentResponse(BaseModel):
    pay_id :int
    orders_id :int
    total_price:int
    datetime_rec:datetime
    status_payment:str
    datetime_pay:datetime
    create_by:str
    checkpay_by:str


