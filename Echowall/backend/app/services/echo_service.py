from sqlalchemy.orm import Session
from app.models.echo import EchoPost
from app.models.like import Like
from app.models.community import Community
from app.schemas.echo import EchoCreateRequest
from datetime import datetime

def get_echo(db: Session, echo_id: int):
    return db.query(EchoPost).filter(EchoPost.id == echo_id).first()

def get_echoes_by_community(db: Session, community_id: int):
    echoes = db.query(EchoPost).filter(EchoPost.community_id == community_id).all()
    for echo in echoes:
        echo.likes_count = db.query(Like).filter(Like.echo_id == echo.id).count()
    return echoes

def create_echo(db: Session, echo: EchoCreateRequest):
    community = db.query(Community).filter(Community.id == echo.community_id).first()
    if not community:
        return None

    now = datetime.utcnow()
    if now > community.reveal_datetime:
        return "CLOSED"

    db_echo = EchoPost(
        community_id=echo.community_id,
        user_id=echo.user_id,
        content=echo.message,
        image_url=echo.image_url, # Save image URL
        theme=echo.theme,
        card_style=echo.card_style,
        voice_url=echo.voice_url,
        reveal_time=community.reveal_datetime,
        status="hidden"
    )
    db.add(db_echo)
    db.commit()
    db.refresh(db_echo)
    db_echo.likes_count = 0
    return db_echo

def like_echo(db: Session, echo_id: int, user_id: int):
    db_echo = get_echo(db, echo_id)
    if not db_echo:
        return None
        
    existing_like = db.query(Like).filter(Like.echo_id == echo_id, Like.user_id == user_id).first()
    if existing_like:
        db.delete(existing_like)
        db.commit()
    else:
        db.add(Like(echo_id=echo_id, user_id=user_id))
        db.commit()
        
    db.refresh(db_echo)
    db_echo.likes_count = db.query(Like).filter(Like.echo_id == db_echo.id).count()
    return db_echo
