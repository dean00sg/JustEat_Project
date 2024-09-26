from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from deps import Base
from typing import List, Optional




class Menu(Base):
    __tablename__ = 'Menu'

    menu_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    image = Column(String)
    price = Column(String)
    category_name =Column(String)
    option_name =Column(String)
    status = Column(String)

    create_by = Column(String)



class LogMenu(Base):
    __tablename__ = 'log_Menu'

    id = Column(Integer, primary_key=True, index=True)
    action_name = Column(String)
    action_datetime = Column(DateTime, default=lambda: datetime.now().replace(microsecond=0))
   
   
   
    menu_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    image = Column(String)
    price = Column(String)
    category_name =Column(String)
    option_name =Column(String)
    status = Column(String)

    create_by = Column(String)

#*************************************************************************



#*************************************************************************
class Option(Base):
    __tablename__ = 'Option'

    Option_id = Column(Integer, primary_key=True, index=True)
    datetime_rec = Column(datetime)
    option_name  = Column(String)
    category_name = Column(String)
    price = Column(String)
    remark = Column(String)

    create_by = Column(String)