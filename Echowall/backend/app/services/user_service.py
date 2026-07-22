from sqlalchemy.orm import Session
from app.models.user import User
from app.models.user_community import UserCommunity
from app.models.echo import EchoPost
from app.models.like import Like
from app.models.community import Community
from app.schemas.user import UserRegister, UserLogin
from datetime import datetime
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hash_bytes)

def get_password_hash(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def register_user(db: Session, user: UserRegister):
    if get_user_by_email(db, user.email):
        return None
    if get_user_by_username(db, user.username):
        return None
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login_user(db: Session, user: UserLogin):
    db_user = get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        return None
    return db_user

def delete_user_account(db: Session, user_id: int):
    db.query(Like).filter(Like.user_id == user_id).delete()
    db.query(EchoPost).filter(EchoPost.user_id == user_id).delete()
    db.query(UserCommunity).filter(UserCommunity.user_id == user_id).delete()
    db.query(User).filter(User.id == user_id).delete()
    db.commit()
    return True

def get_user_stats(db: Session, user_id: int):
    communities_count = db.query(UserCommunity).filter(UserCommunity.user_id == user_id).count()
    echoes_count = db.query(EchoPost).filter(EchoPost.user_id == user_id).count()
    
    now = datetime.utcnow()
    user_communities = db.query(Community).join(UserCommunity, UserCommunity.community_id == Community.id).filter(UserCommunity.user_id == user_id).all()
    reveals_today = sum(1 for c in user_communities if now > c.reveal_datetime)
    
    return {"communities_count": communities_count, "echoes_count": echoes_count, "reveals_today": reveals_today}