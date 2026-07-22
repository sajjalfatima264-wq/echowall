from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime

class UserCommunity(Base):
    __tablename__ = "user_communities"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="communities")
    community = relationship("Community", back_populates="members")
