from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.option import LogOption, Option, OptionCreate, OptionResponse, OptionUpdate
from deps import get_current_user, get_session, get_current_user_role  
from datetime import datetime

router = APIRouter(tags=["option"])

@router.post("/", response_model=OptionResponse, dependencies=[Depends(get_current_user_role)])
async def create_option(option: OptionCreate, db: Session = Depends(get_session), username: str = Depends(get_current_user)):
    new_option = Option(
        option_name=option.option_name,
        category_name=option.category_name,
        price=option.price,
        remark=option.remark,
        created_by=username,  # Set created_by to username
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
        created_by=new_option.created_by,  # Log created_by as username
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

# Update an existing option (admin only)
@router.put("/{option_id}", response_model=OptionResponse, dependencies=[Depends(get_current_user_role)])
async def update_option(
    option_id: int, 
    option: OptionUpdate, 
    db: Session = Depends(get_session), 
    username: str = Depends(get_current_user)  # Correctly specify username here
):
    db_option = db.query(Option).filter(Option.Option_id == option_id).first()

    if not db_option:
        raise HTTPException(status_code=404, detail="Option not found")

    # Log the current state before the update
    log_entry = LogOption(
        action_name="update",
        action_datetime=datetime.now().replace(microsecond=0),
        Option_id=db_option.Option_id,
        option_name=db_option.option_name,  # Old option name
        category_name=db_option.category_name,  # Old category name
        price=db_option.price,  # Old price
        remark=db_option.remark,  # Old remark
        action_by=username,  # Use username from get_current_user
        created_by=db_option.created_by,  # Keep original created_by
        datetime_rec=db_option.datetime_rec
    )

    # Update fields if provided in request
    if option.option_name:
        log_entry.to_option_name = option.option_name  # New option name in the log
        db_option.option_name = option.option_name
    if option.category_name:
        log_entry.to_category_name = option.category_name  # New category name in the log
        db_option.category_name = option.category_name
    if option.price:
        log_entry.to_price = option.price  # New price in the log
        db_option.price = option.price
    if option.remark:
        log_entry.to_remark = option.remark  # New remark in the log
        db_option.remark = option.remark

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
        created_by=db_option.created_by,  # Keep original created_by
        datetime_rec=datetime.now().replace(microsecond=0)
    )

    db.add(log_entry)
    db.commit()

    db.delete(db_option)
    db.commit()

    return {"detail": "Option deleted successfully"}
