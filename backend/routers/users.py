from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from security import AuthHandler, Token
from models.users import LogUserProfile, UpdateUser, UserCreate, UserUpdate, UpdateUserResponse, UserProfile, DeleteResponse, UserAuthen
from deps import get_session, get_current_user

router = APIRouter(tags=["Authentication"])

auth_handler = AuthHandler()

@router.post("/register", response_model=UserAuthen)
async def register_user(user: UserCreate, session: Session = Depends(get_session)):
    role = user.role or "user"  # Default role if not provided
    if role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    hashed_password = auth_handler.get_password_hash(user.password)
    
    db_user = UserProfile(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        contact_number=user.contact_number,
        password=hashed_password,
        role=user.role
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    log_entry = LogUserProfile(
        action_name="insert",
        action_datetime=datetime.now(),
        user_id=db_user.user_id,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        email=db_user.email,
        contact_number=db_user.contact_number,
        password=db_user.password,
        role=db_user.role
    )
    
    session.add(log_entry)
    session.commit()

    return db_user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    user = session.query(UserProfile).filter(UserProfile.email == form_data.username).first()
    
    if not user or not auth_handler.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = auth_handler.create_access_token(data={"username": user.email, "role": user.role})
    
    existing_login = session.query(LogUserProfile).filter(LogUserProfile.user_id == user.user_id).first()
    
    if existing_login:
        existing_login.action_datetime = datetime.now().replace(microsecond=0)
        existing_login.action_name = "login"
        existing_login.password = access_token  # For consistency, using access_token as placeholder
    else:
        log_user_login = LogUserProfile(
            action_name="login",
            action_datetime=datetime.now().replace(microsecond=0),
            user_id=user.user_id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            contact_number=user.contact_number,
            password=access_token,  # For consistency, using access_token as placeholder
            role=user.role
        )
        session.add(log_user_login)

    session.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "name": f"{user.first_name} {user.last_name}",
        "role": user.role
    }

@router.get("/", response_model=UserAuthen)
async def get_user(
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user)
):
    user = session.query(UserProfile).filter(UserProfile.email == current_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.put("/", response_model=UpdateUserResponse)
async def update_user(
    update_data: UpdateUser = Body(...),
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user)
):
    user = session.query(UserProfile).filter(UserProfile.email == current_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    log_entry = LogUserProfile(
        action_name="update",
        action_datetime=datetime.now().replace(microsecond=0), 
        user_id=user.user_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        contact_number=user.contact_number,
        password=user.password,
        role=user.role
    )

    if update_data.new_password:
        user.password = auth_handler.get_password_hash(update_data.new_password)
        log_entry.password = user.password
    if update_data.first_name:
        log_entry.to_first_name = update_data.first_name
        user.first_name = update_data.first_name
    if update_data.last_name:
        log_entry.to_last_name = update_data.last_name
        user.last_name = update_data.last_name
    if update_data.email:
        log_entry.to_email = update_data.email
        user.email = update_data.email
    if update_data.contact_number:
        log_entry.to_contact_number = update_data.contact_number
        user.contact_number = update_data.contact_number

    session.add(log_entry)
    session.add(user)
    session.commit()
    session.refresh(user)

    return UpdateUserResponse(
        status="User updated successfully",
        user_id=user.user_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        contact_number=user.contact_number,
        role=user.role
    )

@router.delete("/", response_model=DeleteResponse)
async def delete_user(
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user)
):
    user = session.query(UserProfile).filter(UserProfile.email == current_user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    log_entry = LogUserProfile(
        action_name="delete",
        action_datetime=datetime.now().replace(microsecond=0), 
        user_id=user.user_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        contact_number=user.contact_number,
        password=user.password,
        role=user.role
    )

    delete_response = DeleteResponse(
        status="User deleted successfully",
        id=user.user_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        contact_number=user.contact_number,
        role=user.role
    )

    session.add(log_entry)
    session.delete(user)
    session.commit()
    
    return delete_response
