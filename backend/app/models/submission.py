from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


class QuizSubmission(Base):
    """Quiz submission model storing only final scores, not individual answers."""
    
    __tablename__ = "quiz_submissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)  # Number of correct answers
    total_questions = Column(Integer, nullable=False)  # Total questions in quiz
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="submissions")
    user = relationship("User", back_populates="submissions")
    
    def __repr__(self):
        return f"<QuizSubmission(id={self.id}, score={self.score}/{self.total_questions})>"
    
    @property
    def percentage(self) -> float:
        """Calculate percentage score."""
        if self.total_questions == 0:
            return 0.0
        return (self.score / self.total_questions) * 100
