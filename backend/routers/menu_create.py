from datetime import datetime
from fastapi import APIRouter, Depends, Form, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from models.category import Category
from models.menu_create import Menu, LogMenu, MenuResponse  # Ensure the correct import
from deps import get_session, get_current_user
import shutil
import os

router = APIRouter(tags=["Menu"])

# Directory to store uploaded images
IMAGE_UPLOAD_DIRECTORY = "./uploaded_images"

# Ensure the upload directory exists
os.makedirs(IMAGE_UPLOAD_DIRECTORY, exist_ok=True)

# Create a new menu
@router.post("/", response_model=MenuResponse, status_code=status.HTTP_201_CREATED)
async def create_menu(
    name: str = Form(...),
    image: UploadFile = File(...),
    category_id: int = Form(...),
    price: str = Form(...),
    remark: Optional[str] = Form(None),
    db: Session = Depends(get_session),
    username: str = Depends(get_current_user),
):
    # Save the uploaded image
    image_path = os.path.join(IMAGE_UPLOAD_DIRECTORY, image.filename)
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Fetch the Category details
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    # Create a new Menu entry
    new_menu = Menu(
        name=name,
        image=image_path,
        category_id=category_id,
        category_name=category.category_name,
        price=price,
        remark=remark,
        create_by=username
    )
    
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)

    # Log the action
    log_entry = LogMenu(
        action_name="insert",
        action_datetime=datetime.now().replace(microsecond=0),
        action_by=username,
        menu_id=new_menu.menu_id,
        name=new_menu.name,
        image=new_menu.image,
        price=new_menu.price,
        category_name=new_menu.category_name,
        create_by=username
    )

    db.add(log_entry)
    db.commit()

    return new_menu


# Retrieve all menus
@router.get("/", response_model=List[MenuResponse])
async def get_menus(db: Session = Depends(get_session)):
    return db.query(Menu).all()


# Retrieve a specific menu by ID
@router.get("/{menu_id}", response_model=MenuResponse)
async def get_menu(menu_id: int, db: Session = Depends(get_session)):
    menu = db.query(Menu).filter(Menu.menu_id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    return menu


# Update an existing menu
@router.put("/{menu_id}", response_model=MenuResponse)
async def update_menu(
    menu_id: int,
    name: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    category_id: Optional[int] = Form(None),
    price: Optional[str] = Form(None),
    status_menu: Optional[str] = Form(None),
    remark: Optional[str] = Form(None),
    db: Session = Depends(get_session),
    username: str = Depends(get_current_user),
):
    menu = db.query(Menu).filter(Menu.menu_id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")

    if image:
        # Save the uploaded image
        image_path = os.path.join(IMAGE_UPLOAD_DIRECTORY, image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        menu.image = image_path
    
    # Update other fields if provided
    menu.name = name if name is not None else menu.name
    menu.category_id = category_id if category_id is not None else menu.category_id
    menu.price = price if price is not None else menu.price
    menu.status_menu = status_menu if status_menu is not None else menu.status_menu
    menu.remark = remark if remark is not None else menu.remark

    db.commit()
    db.refresh(menu)

    # Log the action
    log_entry = LogMenu(
        action_name="update",
        action_datetime=datetime.now().replace(microsecond=0),
        action_by=username,
        menu_id=menu.menu_id,
        name=menu.name,
        image=menu.image,
        price=menu.price,
        category_name=menu.category_name,
        create_by=username
    )

    db.add(log_entry)
    db.commit()

    return menu


# Delete a menu
@router.delete("/{menu_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu(menu_id: int, db: Session = Depends(get_session), username: str = Depends(get_current_user)):
    menu = db.query(Menu).filter(Menu.menu_id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")

    # Log the action before deletion
    log_entry = LogMenu(
        action_name="delete",
        action_datetime=datetime.now().replace(microsecond=0),
        action_by=username,
        menu_id=menu.menu_id,
        name=menu.name,
        image=menu.image,
        price=menu.price,
        category_name=menu.category_name,
        create_by=username
    )
    
    db.add(log_entry)

    db.delete(menu)
    db.commit()

    return {"detail": "Menu deleted successfully"}
