from datetime import datetime
from fastapi import APIRouter, Depends, Form, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from models.menu_create import Menu, LogMenu, MenuResponse  # Ensure you import Menu from the correct module
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
    option_name: str = Form(...),
    category_name: str = Form(...),
    price: str = Form(...),
    remark: str = Form(...),
    db: Session = Depends(get_session),
    username: str = Depends(get_current_user),
):
    # Save the uploaded image
    image_path = os.path.join(IMAGE_UPLOAD_DIRECTORY, image.filename)
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    new_menu = Menu(
        name=name,
        image=image_path,
        option_name=option_name,
        category_name=category_name,
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
        option_name=new_menu.option_name,
        create_by=new_menu.create_by
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
    option_name: Optional[str] = Form(None),
    category_name: Optional[str] = Form(None),
    price: Optional[str] = Form(None),
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
    menu.option_name = option_name if option_name is not None else menu.option_name
    menu.category_name = category_name if category_name is not None else menu.category_name
    menu.price = price if price is not None else menu.price
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
        option_name=menu.option_name,
        create_by=menu.create_by
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
        option_name=menu.option_name,
        create_by=menu.create_by
    )
    
    db.add(log_entry)

    db.delete(menu)
    db.commit()

    return {"detail": "Menu deleted successfully"}
