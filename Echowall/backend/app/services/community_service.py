from sqlalchemy.orm import Session
from app.models.community import Community
from app.models.user_community import UserCommunity
from app.models.user import User
from app.schemas.community import CommunityCreate, JoinCommunityRequest
import secrets

def get_community(db: Session, community_id: int):
    return db.query(Community).filter(Community.id == community_id).first()

def get_community_members(db: Session, community_id: int):
    return db.query(User).join(UserCommunity, UserCommunity.user_id == User.id).filter(UserCommunity.community_id == community_id).all()

def get_user_communities(db: Session, user_id: int):
    return db.query(Community).join(UserCommunity, UserCommunity.community_id == Community.id).filter(UserCommunity.user_id == user_id).all()

def get_community_by_invite_code(db: Session, invite_code: str):
    return db.query(Community).filter(Community.invite_code == invite_code).first()

def create_community(db: Session, community: CommunityCreate, user_id: int):
    invite_code = secrets.token_urlsafe(6)
    while get_community_by_invite_code(db, invite_code): invite_code = secrets.token_urlsafe(6)
    
    # FIX: Added gradient=community.gradient
    db_community = Community(
        name=community.name, 
        reveal_datetime=community.reveal_datetime, 
        invite_code=invite_code,
        gradient=community.gradient
    )
    db.add(db_community)
    db.commit()
    db.refresh(db_community)
    join_community(db, JoinCommunityRequest(invite_code=invite_code, user_id=user_id))
    return db_community

def join_community(db: Session, join_data: JoinCommunityRequest):
    community = get_community_by_invite_code(db, join_data.invite_code)
    if not community: return None
    if not db.query(UserCommunity).filter(UserCommunity.user_id == join_data.user_id, UserCommunity.community_id == community.id).first():
        db.add(UserCommunity(user_id=join_data.user_id, community_id=community.id))
        db.commit()
    return community

def leave_community(db: Session, user_id: int, community_id: int):
    link = db.query(UserCommunity).filter(UserCommunity.user_id == user_id, UserCommunity.community_id == community_id).first()
    if link:
        db.delete(link)
        db.commit()
    return True
