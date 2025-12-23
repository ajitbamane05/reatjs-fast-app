from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.schemas.quiz import QuizListItem, QuizPublic
from app.schemas.submission import QuizSubmissionCreate, QuizSubmissionResponse
from app.services import quiz_service, submission_service

router = APIRouter(prefix="/api/public", tags=["Public Quiz"])


@router.get("/quizzes", response_model=List[QuizListItem])
def list_active_quizzes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List all active quizzes (public, no authentication required).
    
    Args:
        skip: Pagination offset
        limit: Pagination limit
        db: Database session
        
    Returns:
        List of active quiz summaries
    """
    return quiz_service.list_active_quizzes_for_public(db, skip, limit)


@router.get("/quizzes/{quiz_id}", response_model=QuizPublic)
def get_quiz_for_taking(
    quiz_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get quiz questions without answers (public, for taking the quiz).
    
    Args:
        quiz_id: Quiz UUID
        db: Database session
        
    Returns:
        Quiz with questions (no answers)
        
    Raises:
        HTTPException: If quiz not found or inactive
    """
    try:
        return quiz_service.get_quiz_for_public(db, quiz_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/quizzes/{quiz_id}/submit", response_model=QuizSubmissionResponse)
def submit_quiz(
    quiz_id: UUID,
    submission_data: QuizSubmissionCreate,
    db: Session = Depends(get_db)
):
    """
    Submit quiz answers and get results (public, no authentication required).
    
    Args:
        quiz_id: Quiz UUID
        submission_data: Submission data with email and answers
        db: Database session
        
    Returns:
        Quiz results with score and correct answers
        
    Raises:
        HTTPException: If quiz not found or inactive
    """
    try:
        return submission_service.process_quiz_submission(db, quiz_id, submission_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
