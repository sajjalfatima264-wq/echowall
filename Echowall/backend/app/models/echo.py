from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime

class EchoPost(Base):
    __tablename__ = "echo_posts"
    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=True) # Made nullable in case it's just a picture
    image_url = Column(String, nullable=True) # NEW: Image URL
    theme = Column(String, nullable=False)
    card_style = Column(String, nullable=False)
    voice_url = Column(String, nullable=True)
    status = Column(String, default="hidden", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    reveal_time = Column(DateTime, nullable=False)
    community = relationship("Community", back_populates="echoes")
    user = relationship("User", back_populates="echoes")
    likes = relationship("Like", back_populates="echo")
