from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
from uuid import UUID
from enum import Enum


class QuestionType(str, Enum):
    """Question type enum."""
    MCQ = "mcq"
    TRUE_FALSE = "true_false"
    TEXT = "text"


class AnswerCreate(BaseModel):
    """Schema for creating an answer."""
    correct_answer: str
    explanation: Optional[str] = None


class AnswerResponse(BaseModel):
    """Schema for answer response (admin view)."""
    id: UUID
    question_id: UUID
    correct_answer: str
    explanation: Optional[str] = None
    
    class Config:
        from_attributes = True


class QuestionCreate(BaseModel):
    """Schema for creating a question."""
    question_type: QuestionType
    question_text: str
    options: Optional[Dict[str, str]] = None  # For MCQ: {"A": "option1", "B": "option2"}
    order: int
    answer: AnswerCreate


class QuestionResponse(BaseModel):
    """Schema for question response (admin view with answers)."""
    id: UUID
    quiz_id: UUID
    question_type: QuestionType
    question_text: str
    options: Optional[Dict[str, str]] = None
    order: int
    answer: Optional[AnswerResponse] = None
    
    class Config:
        from_attributes = True


class QuestionPublic(BaseModel):
    """Schema for public question (without answers)."""
    id: UUID
    question_type: QuestionType
    question_text: str
    options: Optional[Dict[str, str]] = None
    order: int
    
    class Config:
        from_attributes = True


class QuizBase(BaseModel):
    """Base schema for Quiz."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    is_active: bool = True


class QuizCreate(QuizBase):
    """Schema for creating a quiz with questions."""
    questions: List[QuestionCreate] = Field(..., min_items=1)


class QuizUpdate(BaseModel):
    """Schema for updating a quiz."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class QuizResponse(QuizBase):
    """Schema for quiz response (admin view with answers)."""
    id: UUID
    admin_id: UUID
    created_at: datetime
    questions: List[QuestionResponse] = []
    
    class Config:
        from_attributes = True


class QuizListItem(BaseModel):
    """Schema for quiz list item (summary)."""
    id: UUID
    title: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    question_count: int
    
    class Config:
        from_attributes = True


class QuizPublic(BaseModel):
    """Schema for public quiz view (without answers)."""
    id: UUID
    title: str
    description: Optional[str] = None
    created_at: datetime
    questions: List[QuestionPublic] = []
    
    class Config:
        from_attributes = True
