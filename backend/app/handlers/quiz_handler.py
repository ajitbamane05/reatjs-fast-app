from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.core.security import get_current_admin
from app.schemas.quiz import QuizCreate, QuizUpdate, QuizResponse, QuizListItem
from app.services import quiz_service
from app.models.admin import Admin

router = APIRouter(prefix="/api/quizzes", tags=["Quiz Management (Admin)"])


@router.post("", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Create a new quiz with questions and answers (Admin only).
    
    Args:
        quiz_data: Quiz creation data
        db: Database session
        current_admin: Current authenticated admin
        
    Returns:
        Created quiz information
        
    Raises:
        HTTPException: If validation fails
    """
    try:
        return quiz_service.create_quiz_with_questions(db, quiz_data, current_admin.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("", response_model=List[QuizListItem])
def list_quizzes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    List all quizzes created by the current admin.
    
    Args:
        skip: Pagination offset
        limit: Pagination limit
        db: Database session
        current_admin: Current authenticated admin
        
    Returns:
        List of quiz summaries
    """
    return quiz_service.list_quizzes_for_admin(db, current_admin.id, skip, limit)


@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(
    quiz_id: UUID,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get quiz details with questions and answers (Admin only).
    
    Args:
        quiz_id: Quiz UUID
        db: Database session
        current_admin: Current authenticated admin
        
    Returns:
        Quiz details
        
    Raises:
        HTTPException: If quiz not found
    """
    try:
        return quiz_service.get_quiz_for_admin(db, quiz_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.put("/{quiz_id}", response_model=QuizResponse)
def update_quiz(
    quiz_id: UUID,
    quiz_data: QuizUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Update quiz details (Admin only, must own the quiz).
    
    Args:
        quiz_id: Quiz UUID
        quiz_data: Quiz update data
        db: Database session
        current_admin: Current authenticated admin
        
    Returns:
        Updated quiz information
        
    Raises:
        HTTPException: If quiz not found or unauthorized
    """
    try:
        return quiz_service.update_quiz_details(db, quiz_id, quiz_data, current_admin.id)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=str(e)
            )


@router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(
    quiz_id: UUID,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Delete quiz (Admin only, must own the quiz).
    
    Args:
        quiz_id: Quiz UUID
        db: Database session
        current_admin: Current authenticated admin
        
    Raises:
        HTTPException: If quiz not found or unauthorized
    """
    try:
        quiz_service.delete_quiz_by_id(db, quiz_id, current_admin.id)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=str(e)
            )
