from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from models.payment import Payment, PaymentCreate, PaymentUpdate, PaymentResponse
from models.orders import OrdersFood  # นำเข้า OrdersFood เพื่อใช้ในโค้ด
from deps import get_current_user, get_session

router = APIRouter(tags=["Payments"])

# Create a new payment (POST)
@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(
    orders_id: int = Form(...), 
    db: Session = Depends(get_session), 
    username: str = Depends(get_current_user)
):
    # ดึงข้อมูล OrdersFood ตาม orders_id
    orders_food = db.query(OrdersFood).filter(OrdersFood.orders_id == orders_id).first()

    if not orders_food:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # สร้างข้อมูลการชำระเงินใหม่
    new_payment = Payment(
        orders_id=orders_food.orders_id,  
        total_price=orders_food.total_price, 
        datetime_rec=datetime.now(),
        status_payment="Pending",  # สถานะเริ่มต้น
        datetime_pay=datetime.now().replace(microsecond=0), 
        create_by=username,  
        checkpay_by="" 
    )
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    
    return PaymentResponse(
        pay_id=new_payment.pay_id,
        orders_id=new_payment.orders_id,
        total_price=new_payment.total_price,
        datetime_rec=new_payment.datetime_rec,
        status_payment=new_payment.status_payment,
        datetime_pay=new_payment.datetime_pay,
        create_by=new_payment.create_by,
        checkpay_by=new_payment.checkpay_by
    )

@router.get("/", response_model=List[PaymentResponse])
async def get_all_payments(
    db: Session = Depends(get_session)
):
    payments = db.query(Payment).all()
    return payments

# Get payment by ID (GET)
@router.get("/{pay_id}", response_model=PaymentResponse)
async def get_payment_by_id(
    pay_id: int, 
    db: Session = Depends(get_session)
):
    payment = db.query(Payment).filter(Payment.pay_id == pay_id).first()

    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    
    return PaymentResponse(
        pay_id=payment.pay_id,
        orders_id=payment.orders_id,
        total_price=payment.total_price,
        datetime_rec=payment.datetime_rec,
        status_payment=payment.status_payment,
        datetime_pay=payment.datetime_pay,
        create_by=payment.create_by,
        checkpay_by=payment.checkpay_by
    )




# Update payment by ID (PUT)
@router.put("/{pay_id}", response_model=PaymentResponse)
async def update_payment(
    pay_id: int, 
    status_payment: str = Form(...), 
    db: Session = Depends(get_session), 
    username: str = Depends(get_current_user)
):
    payment = db.query(Payment).filter(Payment.pay_id == pay_id).first()
    
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    
    # อัปเดตข้อมูลการชำระเงิน
    payment.status_payment = status_payment
    payment.datetime_pay = datetime.now().replace(microsecond=0),
    payment.checkpay_by = username  
    
    db.commit()
    db.refresh(payment)
    
    return PaymentResponse(
        pay_id=payment.pay_id,
        orders_id=payment.orders_id,
        total_price=payment.total_price,
        datetime_rec=payment.datetime_rec,
        status_payment=payment.status_payment,
        datetime_pay=payment.datetime_pay,
        create_by=payment.create_by,
        checkpay_by=payment.checkpay_by
    )
