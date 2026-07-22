from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List

class CommunityBase(BaseModel):
    name: str
    reveal_datetime: datetime
    gradient: str = "Violet" # NEW: Accept gradient

class CommunityCreate(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    id: int
    invite_code: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class JoinCommunityRequest(BaseModel):
    invite_code: str
    user_id: int

class MemberResponse(BaseModel):
    id: int
    username: str
    model_config = ConfigDict(from_attributes=True)
