from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services import user_service
from app.schemas.user import UserRegister, UserLogin, UserResponse

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    db_user = user_service.register_user(db=db, user=user)
    if db_user is None:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    return db_user

@router.post("/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = user_service.login_user(db=db, user=user)
    if db_user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return db_user

@router.delete("/{user_id}")
def delete_account(user_id: int, db: Session = Depends(get_db)):
    user_service.delete_user_account(db=db, user_id=user_id)
    return {"message": "Account deleted successfully"}

@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    return user_service.get_user_stats(db=db, user_id=user_id)
