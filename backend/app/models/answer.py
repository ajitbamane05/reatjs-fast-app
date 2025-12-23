from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base


class Answer(Base):
    """Answer model storing correct answers and explanations."""
    
    __tablename__ = "answers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False, unique=True)
    correct_answer = Column(Text, nullable=False)  # Stores the correct answer
    explanation = Column(Text, nullable=True)  # Optional explanation
    
    # Relationships
    question = relationship("Question", back_populates="answer")
    
    def __repr__(self):
        return f"<Answer(id={self.id}, question_id={self.question_id})>"
