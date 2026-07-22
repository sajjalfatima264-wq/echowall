from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services import community_service
from app.schemas.community import CommunityCreate, CommunityResponse, JoinCommunityRequest, MemberResponse
from typing import List

router = APIRouter()

@router.post("/create", response_model=CommunityResponse, status_code=201)
def create_community(community: CommunityCreate, user_id: int, db: Session = Depends(get_db)):
    return community_service.create_community(db=db, community=community, user_id=user_id)

@router.post("/join", response_model=CommunityResponse)
def join_community(join_data: JoinCommunityRequest, db: Session = Depends(get_db)):
    db_community = community_service.join_community(db=db, join_data=join_data)
    if db_community is None:
        raise HTTPException(status_code=404, detail="Invalid invite code")
    return db_community

@router.get("/", response_model=List[CommunityResponse])
def get_user_communities(user_id: int, db: Session = Depends(get_db)):
    return community_service.get_user_communities(db=db, user_id=user_id)

@router.get("/{community_id}", response_model=CommunityResponse)
def get_community(community_id: int, db: Session = Depends(get_db)):
    db_community = community_service.get_community(db, community_id=community_id)
    if not db_community:
        raise HTTPException(status_code=404, detail="Community not found")
    return db_community

@router.get("/{community_id}/members", response_model=List[MemberResponse])
def get_community_members(community_id: int, db: Session = Depends(get_db)):
    return community_service.get_community_members(db, community_id=community_id)

@router.post("/{community_id}/leave")
def leave_community(community_id: int, user_id: int, db: Session = Depends(get_db)):
    community_service.leave_community(db, user_id=user_id, community_id=community_id)
    return {"message": "Successfully left community"}
