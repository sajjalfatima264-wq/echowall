from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class EchoCreateRequest(BaseModel):
    community_id: int
    user_id: int
    message: Optional[str] = None # Made optional
    image_url: Optional[str] = None # NEW
    theme: str
    card_style: str
    voice_url: Optional[str] = None

class EchoResponse(BaseModel):
    id: int
    community_id: int
    user_id: int
    content: Optional[str] = None
    image_url: Optional[str] = None # NEW
    theme: str
    card_style: str
    voice_url: Optional[str] = None
    status: str
    created_at: datetime
    reveal_time: datetime
    likes_count: int
    model_config = ConfigDict(from_attributes=True)

class EchoStatusLocked(BaseModel):
    status: str = "locked"
    remaining_time: str
    echoes_count: int

class EchoStatusRevealed(BaseModel):
    status: str = "revealed"
    echoes: List[EchoResponse]
