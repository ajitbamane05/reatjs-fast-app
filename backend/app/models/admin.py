from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


class Admin(Base):
    """Admin model for authentication and quiz management."""
    
    __tablename__ = "admins"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    quizzes = relationship("Quiz", back_populates="admin", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Admin(id={self.id}, email={self.email})>"
