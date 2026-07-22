from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime

class Community(Base):
    __tablename__ = "communities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    invite_code = Column(String, unique=True, index=True, nullable=False)
    reveal_datetime = Column(DateTime, nullable=False)
    gradient = Column(String, default="Violet", nullable=False) # NEW: Gradient name
    created_at = Column(DateTime, default=datetime.utcnow)
    members = relationship("UserCommunity", back_populates="community")
    echoes = relationship("EchoPost", back_populates="community")
