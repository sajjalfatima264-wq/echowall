import base64
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime
import os
import uuid
from app.database.connection import get_db
from app.services import echo_service, community_service
from app.schemas.echo import EchoCreateRequest, EchoResponse, EchoStatusLocked, EchoStatusRevealed
from pydantic import BaseModel

router = APIRouter()
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ImageUpload(BaseModel):
    base64: str

@router.post("/upload")
def upload_image(payload: ImageUpload):
    image_data = base64.b64decode(payload.base64.split(",")[1])
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(image_data)
    return {"url": f"/api/echo/uploads/{filename}"}

# NEW: Audio Upload Endpoint
@router.post("/upload-audio")
def upload_audio(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1] if file.filename else "m4a"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())
    return {"url": f"/api/echo/uploads/{filename}"}

@router.post("/create", response_model=EchoResponse, status_code=201)
def create_echo(echo: EchoCreateRequest, db: Session = Depends(get_db)):
    db_echo = echo_service.create_echo(db=db, echo=echo)
    if db_echo == "CLOSED":
        raise HTTPException(status_code=403, detail="The window for this community's echoes has closed.")
    if db_echo is None:
        raise HTTPException(status_code=404, detail="Community not found")
    return db_echo

@router.get("/status/{community_id}")
def check_echo_status(community_id: int, db: Session = Depends(get_db)):
    community = community_service.get_community(db, community_id=community_id)
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
        
    now = datetime.utcnow()
    if now < community.reveal_datetime:
        echoes = echo_service.get_echoes_by_community(db, community_id=community_id)
        delta = community.reveal_datetime - now
        total_seconds = int(delta.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        time_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        return EchoStatusLocked(status="locked", remaining_time=time_str, echoes_count=len(echoes))
    else:
        echoes = echo_service.get_echoes_by_community(db, community_id=community_id)
        return EchoStatusRevealed(status="revealed", echoes=echoes)

@router.post("/{echo_id}/like", response_model=EchoResponse)
def like_echo(echo_id: int, user_id: int, db: Session = Depends(get_db)):
    db_echo = echo_service.like_echo(db, echo_id=echo_id, user_id=user_id)
    if db_echo is None:
        raise HTTPException(status_code=404, detail="Echo not found")
    return db_echo
