from pydantic import BaseModel, EmailStr
from typing import Dict, List, Optional
from datetime import datetime
from uuid import UUID


class UserAnswerInput(BaseModel):
    """Schema for a single user answer."""
    question_id: UUID
    answer: str


class QuizSubmissionCreate(BaseModel):
    """Schema for submitting a quiz."""
    email: EmailStr
    answers: Dict[str, str]  # question_id (as string) -> user_answer


class QuestionResult(BaseModel):
    """Schema for individual question result."""
    question_id: UUID
    question_text: str
    user_answer: str
    correct_answer: str
    is_correct: bool
    explanation: Optional[str] = None


class QuizSubmissionResponse(BaseModel):
    """Schema for quiz submission response with results."""
    submission_id: UUID
    quiz_id: UUID
    quiz_title: str
    user_email: str
    score: int
    total_questions: int
    percentage: float
    submitted_at: datetime
    results: List[QuestionResult]
    
    class Config:
        from_attributes = True


class SubmissionSummary(BaseModel):
    """Schema for submission summary (without detailed results)."""
    id: UUID
    quiz_id: UUID
    user_id: UUID
    score: int
    total_questions: int
    percentage: float
    submitted_at: datetime
    
    class Config:
        from_attributes = True
