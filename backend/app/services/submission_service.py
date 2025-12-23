from sqlalchemy.orm import Session, joinedload
from typing import Dict
from uuid import UUID
from app.accessors import user_accessor, quiz_accessor, submission_accessor
from app.models.question import Question
from app.schemas.submission import QuizSubmissionCreate, QuizSubmissionResponse


def process_quiz_submission(
    db: Session,
    quiz_id: UUID,
    submission_data: QuizSubmissionCreate
) -> QuizSubmissionResponse:
    """
    Process quiz submission: create/get user, calculate score, store submission.
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        submission_data: Submission data with email and answers
        
    Returns:
        QuizSubmissionResponse with results
        
    Raises:
        ValueError: If quiz not found or inactive
    """
    # Get quiz with questions and answers
    quiz = quiz_accessor.get_quiz_by_id(db, quiz_id, load_questions=True)
    
    if not quiz:
        raise ValueError("Quiz not found")
    
    if not quiz.is_active:
        raise ValueError("Quiz is not active")
    
    # Create or get user
    user = user_accessor.create_or_get_user(db, submission_data.email)
    
    # Calculate score and get results (real-time, not stored)
    score, results = submission_accessor.calculate_score(quiz, submission_data.answers)
    
    # Create submission record (only stores final score)
    submission = submission_accessor.create_submission_record(
        db=db,
        quiz_id=quiz_id,
        user_id=user.id,
        score=score,
        total_questions=len(quiz.questions)
    )
    
    # Format and return response
    return QuizSubmissionResponse(
        submission_id=submission.id,
        quiz_id=quiz.id,
        quiz_title=quiz.title,
        user_email=user.email,
        score=submission.score,
        total_questions=submission.total_questions,
        percentage=submission.percentage,
        submitted_at=submission.submitted_at,
        results=results
    )
