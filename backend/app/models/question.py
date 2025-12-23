from sqlalchemy import Column, String, Text, Integer, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
import enum
from app.core.database import Base


class QuestionType(str, enum.Enum):
    """Enum for question types."""
    MCQ = "mcq"
    TRUE_FALSE = "true_false"
    TEXT = "text"


class Question(Base):
    """Question model supporting multiple question types."""
    
    __tablename__ = "questions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"), nullable=False)
    question_type = Column(Enum(QuestionType), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSONB, nullable=True)  # For MCQ options: {"A": "option1", "B": "option2", ...}
    order = Column(Integer, nullable=False)  # Order of question in quiz
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    answer = relationship("Answer", back_populates="question", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Question(id={self.id}, type={self.question_type}, order={self.order})>"
