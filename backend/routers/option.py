from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List
from models.category import Category  # Import Category model
from models.option import LogOption, Option, OptionCreate, OptionResponse, OptionUpdate
from deps import get_current_user, get_session, get_current_user_role
from datetime import datetime

router = APIRouter(tags=["option"])

# Create a new option
@router.post("/", response_model=OptionResponse, dependencies=[Depends(get_current_user_role)])
async def create_option(
    option_name: str = Form(...),
    category_id: int = Form(...),
    price: float = Form(...),
    remark: str = Form(...),
    db: Session = Depends(get_session),
    username: str = Depends(get_current_user)
):
    # Fetch the category based on the category_id
    category = db.query(Category).filter(Category.category_id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Create a new option entry with the fetched category_name
    new_option = Option(
        option_name=option_name,
        category_id=category_id,
        category_name=category.category_name,
        price=price,
        remark=remark,
        created_by=username,
        datetime_rec=datetime.now().replace(microsecond=0)
    )
    db.add(new_option)
    db.commit()
    db.refresh(new_option)

    # Log the action
    log_entry = LogOption(
        action_name="insert",
        action_datetime=datetime.now().replace(microsecond=0),
        Option_id=new_option.Option_id,
        option_name=new_option.option_name,
        category_name=new_option.category_name,
        price=new_option.price,
        remark=new_option.remark,
        created_by=new_option.created_by,
        action_by=new_option.created_by,
        datetime_rec=new_option.datetime_rec
    )
    db.add(log_entry)
    db.commit()

    return new_option

# Get a list of all options (admin only)
@router.get("/", response_model=List[OptionResponse], dependencies=[Depends(get_current_user_role)])
async def get_options(db: Session = Depends(get_session)):
    options = db.query(Option).all()
    return options

# Get option by ID (admin only)
@router.get("/{option_id}", response_model=OptionResponse, dependencies=[Depends(get_current_user_role)])
async def get_option(option_id: int, db: Session = Depends(get_session)):
    db_option = db.query(Option).filter(Option.Option_id == option_id).first()

    if not db_option:
        raise HTTPException(status_code=404, detail="Option not found")

    return db_option

@router.put("/{option_id}", response_model=OptionResponse, dependencies=[Depends(get_current_user_role)])
async def update_option(
    option_id: int, 
    option_name: str = Form(None), 
    category_id: int = Form(None), 
    price: float = Form(None), 
    remark: str = Form(None),
    status_option: str = Form(None),  # Add status_option here
    db: Session = Depends(get_session), 
    username: str = Depends(get_current_user)
):
    db_option = db.query(Option).filter(Option.Option_id == option_id).first()

    if not db_option:
        raise HTTPException(status_code=404, detail="Option not found")

    # Log the current state before the update
    log_entry = LogOption(
        action_name="update",
        action_datetime=datetime.now().replace(microsecond=0),
        Option_id=db_option.Option_id,
        option_name=db_option.option_name,
        category_name=db_option.category_name,
        price=db_option.price,
        remark=db_option.remark,
        action_by=username,
        created_by=db_option.created_by,
        datetime_rec=db_option.datetime_rec
    )

    # Update fields if provided in request
    if option_name is not None:
        log_entry.to_option_name = option_name
        db_option.option_name = option_name
    if category_id is not None:
        category = db.query(Category).filter(Category.category_id == category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        log_entry.to_category_name = category.category_name
        db_option.category_id = category_id
        db_option.category_name = category.category_name
    if price is not None:
        log_entry.to_price = price
        db_option.price = price
    if remark is not None:
        log_entry.to_remark = remark
        db_option.remark = remark
    if status_option is not None: 
        db_option.status_option = status_option

    db.commit()
    db.refresh(db_option)

    # Log the update action
    db.add(log_entry)
    db.commit()

    return db_option

# Delete an option (admin only)
@router.delete("/{option_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_user_role)])
async def delete_option(option_id: int, db: Session = Depends(get_session), username: str = Depends(get_current_user)):
    db_option = db.query(Option).filter(Option.Option_id == option_id).first()

    if not db_option:
        raise HTTPException(status_code=404, detail="Option not found")

    # Log the deletion before removing the entry
    log_entry = LogOption(
        action_name="delete",
        action_datetime=datetime.now().replace(microsecond=0),
        Option_id=db_option.Option_id,
        option_name=db_option.option_name,
        category_name=db_option.category_name,
        price=db_option.price,
        remark=db_option.remark,
        action_by=username,
        created_by=db_option.created_by,
        datetime_rec=datetime.now().replace(microsecond=0)
    )

    db.add(log_entry)
    db.commit()

    db.delete(db_option)
    db.commit()
