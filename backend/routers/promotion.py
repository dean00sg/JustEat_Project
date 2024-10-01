from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from models.promotion import Promotion, MenuResponse, LogPromotion
from deps import get_session, get_current_user
from datetime import datetime
import os  # Import os module for directory operations

# Define the directory for uploaded images
IMAGE_UPLOAD_DIRECTORY = "./uploaded_imagesPromotion"

router = APIRouter(tags=["promotion"])

# Ensure the upload directory exists
if not os.path.exists(IMAGE_UPLOAD_DIRECTORY):
    os.makedirs(IMAGE_UPLOAD_DIRECTORY)

@router.post("/", response_model=MenuResponse)
async def create_promotion(
    header: str,
    name_menu:str,
    description: str,
    enddatetime: str,
    image: UploadFile = File(...),
    db: Session = Depends(get_session),
    username: str = Depends(get_current_user)
):
    # Parse the enddatetime string into a datetime object
    try:
        end_datetime_obj = datetime.fromisoformat(enddatetime)  # ISO format (YYYY-MM-DDTHH:MM:SS)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DDTHH:MM:SS.")

    # Save the uploaded image
    image_path = os.path.join(IMAGE_UPLOAD_DIRECTORY, image.filename)  # Define your image storage path
    with open(image_path, "wb") as image_file:
        content = await image.read()
        image_file.write(content)

    new_promotion = Promotion(
        header=header,
        name_menu=name_menu,
        image=image_path,
        description=description,
        startdatetime=datetime.now().replace(microsecond=0),
        enddatetime=end_datetime_obj,
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
        name_menu=new_promotion.name_menu,
        startdatetime=new_promotion.startdatetime,
        enddatetime=new_promotion.enddatetime,
        image=new_promotion.image,
        description=new_promotion.description,
        create_by=new_promotion.create_by,
        action_by=username,
        datetime_rec=new_promotion.datetime_rec
    )
    
    db.add(log_entry)
    db.commit()

    return new_promotion


# Get a list of all promotions
@router.get("/", response_model=List[MenuResponse])
async def get_promotions(db: Session = Depends(get_session)):
    promotions = db.query(Promotion).all()
    return promotions


@router.put("/{promotion_id}", response_model=MenuResponse)
async def update_promotion(
    promotion_id: int, 
    header: str = None, 
    name_menu:str= None, 
    description: str = None, 
    enddatetime: str = None,
    image: UploadFile = File(None),  # Optional image upload
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

    if name_menu:
        db_promotion.name_menu = name_menu

    if description:
        db_promotion.description = description
    if enddatetime:
        try:
            db_promotion.enddatetime = datetime.fromisoformat(enddatetime)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DDTHH:MM:SS.")
    if image:
        # Define your image storage path
        image_directory = "./uploaded_imagesPromotion"
        if not os.path.exists(image_directory):
            os.makedirs(image_directory)

        image_filename = os.path.join(image_directory, image.filename)  # Ensure to save in the correct directory
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
