# routers/category.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.category import Category, CategoryCreate, CategoryUpdate, CategoryResponse, LogCategory
from deps import get_session, get_current_user
from datetime import datetime

router = APIRouter(tags=["category"])

# Create a new category
@router.post("/", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, db: Session = Depends(get_session), username: str = Depends(get_current_user)):
    new_category = Category(
        category_name=category.category_name,
        remark=category.remark,
        created_by=username,
        datetime_rec=datetime.now().replace(microsecond=0),
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    # Create log entry
    log_entry = LogCategory(
        action_name="insert",
        action_datetime=datetime.now().replace(microsecond=0),
        category_id=new_category.category_id,
        category_name=new_category.category_name,
        remark=new_category.remark,
        created_by=new_category.created_by,
        action_by=username,
        datetime_rec=datetime.now().replace(microsecond=0)
    )
    db.add(log_entry)
    db.commit()

    return new_category

# Get a list of all categories
@router.get("/", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_session)):
    categories = db.query(Category).all()
    return categories

# Update an existing category
@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int, 
    category: CategoryUpdate, 
    db: Session = Depends(get_session), 
    username: str = Depends(get_current_user)
):
    db_category = db.query(Category).filter(Category.category_id == category_id).first()

    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Log the current state before the update
    log_entry = LogCategory(
        action_name="update",
        action_datetime=datetime.now().replace(microsecond=0),
        category_id=db_category.category_id,
        category_name=db_category.category_name,
        remark=db_category.remark,
        action_by=username,
        datetime_rec=db_category.datetime_rec,
    )

    # Update fields if provided in request
    if category.category_name:
        log_entry.to_category_name = category.category_name
        db_category.category_name = category.category_name
    if category.remark:
        log_entry.to_remark = category.remark
        db_category.remark = category.remark
    
    db.commit()
    db.refresh(db_category)

    # Log the action
    db.add(log_entry)
    db.commit()

    return db_category


@router.delete("/{category_id}", response_model=CategoryResponse)
async def delete_category(
    category_id: int, 
    db: Session = Depends(get_session), 
    username: str = Depends(get_current_user)
):
    db_category = db.query(Category).filter(Category.category_id == category_id).first()

    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Log the deletion before removing the entry
    log_entry = LogCategory(
        action_name="delete",
        action_datetime=datetime.now().replace(microsecond=0),
        category_id=db_category.category_id,
        category_name=db_category.category_name,
        remark=db_category.remark,
        action_by=username,  # Log who performed the delete action
        created_by=db_category.created_by  # Ensure created_by is populated
    )

    db.add(log_entry)  # Log the action first
    db.commit()

    # Prepare response data before deletion
    response_data = CategoryResponse(
        category_id=db_category.category_id,
        category_name=db_category.category_name,
        remark=db_category.remark,
        created_by=db_category.created_by
    )

    db.delete(db_category)  # Now delete the category
    db.commit()

    return response_data