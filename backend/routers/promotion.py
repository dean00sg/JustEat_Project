from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from models import menu_create
from models.promotion import MenuCreate, Promotion, MenuResponse, LogPromotion
from deps import get_session, get_current_user
from datetime import datetime
import os

# Define the directory for uploaded images
IMAGE_UPLOAD_DIRECTORY = "./uploaded_imagesPromotion"

router = APIRouter(tags=["promotion"])

# Ensure the upload directory exists
if not os.path.exists(IMAGE_UPLOAD_DIRECTORY):
    os.makedirs(IMAGE_UPLOAD_DIRECTORY)

@router.post("/", response_model=MenuResponse)
async def create_promotion(
    header: str = Form(...),  # Use Form for header
    menu_id: int = Form(...),  # Use Form for menu_id
    description: str = Form(...),  # Use Form for description
    enddatetime: datetime = Form(...),  # Use Form for enddatetime
    image: UploadFile = File(...),
    db: Session = Depends(get_session),
    username: str = Depends(get_current_user)
):
    # Fetch the menu name based on the provided menu_id
    menu_item = db.query(menu_create.Menu).filter(menu_create.Menu.menu_id == menu_id).first()

    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    # Save the uploaded image
    image_path = os.path.join(IMAGE_UPLOAD_DIRECTORY, image.filename)
    with open(image_path, "wb") as image_file:
        content = await image.read()
        image_file.write(content)

    new_promotion = Promotion(
        header=header,
        menu_id=menu_id,
        name_menu=menu_item.name,  # Get name_menu from the menu_item
        image=image_path,
        description=description,
        startdatetime=datetime.now().replace(microsecond=0),
        enddatetime=enddatetime,
        create_by=username
    )

    db.add(new_promotion)
    db.commit()
    db.refresh(new_promotion)

    # Create log entry
    log_entry = LogPromotion(
        action_name="insert",
        action_datetime=datetime.now().replace(microsecond=0),
        promotion_id=new_promotion.promotion_id,
        header=new_promotion.header,
        name_menu=new_promotion.name_menu,  # Use the name_menu from new promotion
        startdatetime=new_promotion.startdatetime,
        enddatetime=new_promotion.enddatetime,
        image=new_promotion.image,
        description=new_promotion.description,
        create_by=username,
        action_by=username,
        datetime_rec=new_promotion.datetime_rec
    )

    db.add(log_entry)
    db.commit()

    return new_promotion


@router.get("/", response_model=List[MenuResponse])
async def get_promotions(db: Session = Depends(get_session)):
    promotions = db.query(Promotion).all()
    return promotions


@router.put("/{promotion_id}", response_model=MenuResponse)
async def update_promotion(
    promotion_id: int, 
    header: Optional[str] = Form(None),  # Use Form for optional header
    name_menu: Optional[str] = Form(None),  # Use Form for optional name_menu
    menu_id: Optional[int] = Form(None),  # Use Form for optional menu_id
    description: Optional[str] = Form(None),  # Use Form for optional description
    enddatetime: Optional[datetime] = Form(None),  # Use Form for optional enddatetime
    image: UploadFile = File(None), 
    db: Session = Depends(get_session), 
    username: str = Depends(get_current_user)
):
    db_promotion = db.query(Promotion).filter(Promotion.promotion_id == promotion_id).first()

    if not db_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")
    
    # Log the current state before the update
    log_entry = LogPromotion(
        action_name="update",
        action_datetime=datetime.now().replace(microsecond=0),
        promotion_id=db_promotion.promotion_id,
        header=db_promotion.header,
        name_menu=db_promotion.name_menu,
        startdatetime=db_promotion.startdatetime,
        enddatetime=db_promotion.enddatetime,
        image=db_promotion.image,
        description=db_promotion.description,
        create_by=db_promotion.create_by,
        action_by=username,
        datetime_rec=db_promotion.datetime_rec
    )

    # Update fields if provided in request
    if header:
        db_promotion.header = header

    if menu_id is not None:  # Update only if provided
        db_promotion.menu_id = menu_id

    if description:
        db_promotion.description = description
    if enddatetime:
        db_promotion.enddatetime = enddatetime
    if image:
        # Handle image upload as before
        image_filename = os.path.join(IMAGE_UPLOAD_DIRECTORY, image.filename)
        with open(image_filename, "wb") as image_file:
            content = await image.read()
            image_file.write(content)
        db_promotion.image = image_filename  # Update the image path

    db.commit()
    db.refresh(db_promotion)

    # Log the action
    db.add(log_entry)
    db.commit()

    return db_promotion


@router.delete("/{promotion_id}", response_model=MenuResponse)
async def delete_promotion(
    promotion_id: int, 
    db: Session = Depends(get_session), 
    username: str = Depends(get_current_user)
):
    db_promotion = db.query(Promotion).filter(Promotion.promotion_id == promotion_id).first()

    if not db_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")

    # Log the deletion before removing the entry
    log_entry = LogPromotion(
        action_name="delete",
        action_datetime=datetime.now().replace(microsecond=0),
        promotion_id=db_promotion.promotion_id,
        header=db_promotion.header,
        name_menu=db_promotion.name_menu,
        startdatetime=db_promotion.startdatetime,
        enddatetime=db_promotion.enddatetime,
        image=db_promotion.image,
        description=db_promotion.description,
        create_by=db_promotion.create_by,
        action_by=username,
        datetime_rec=db_promotion.datetime_rec
    )

    db.add(log_entry)  # Log the action first
    db.commit()

    # Prepare response data before deletion
    response_data = MenuResponse(
        promotion_id=db_promotion.promotion_id,
        header=db_promotion.header,
        name_menu=db_promotion.name_menu,
        image=db_promotion.image,
        description=db_promotion.description,
        startdatetime=db_promotion.startdatetime,
        enddatetime=db_promotion.enddatetime,
        remark="Promotion deleted successfully",  # Add a remark
        create_by=db_promotion.create_by,
    )

    db.delete(db_promotion)  # Now delete the promotion
    db.commit()

    return response_data
