from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.accessors import quiz_accessor
from app.schemas.quiz import (
    QuizCreate, QuizUpdate, QuizResponse, 
    QuizListItem, QuizPublic, QuestionPublic
)
from app.models.quiz import Quiz


def create_quiz_with_questions(
    db: Session,
    quiz_data: QuizCreate,
    admin_id: UUID
) -> QuizResponse:
    """
    Create a new quiz with questions and answers.
    
    Args:
        db: Database session
        quiz_data: Quiz creation data
        admin_id: Admin UUID
        
    Returns:
        QuizResponse schema
        
    Raises:
        ValueError: If validation fails
    """
    quiz = quiz_accessor.create_quiz(db, quiz_data, admin_id)
    return QuizResponse.model_validate(quiz)


def get_quiz_for_admin(db: Session, quiz_id: UUID) -> QuizResponse:
    """
    Get quiz with all details including answers (admin view).
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        
    Returns:
        QuizResponse schema
        
    Raises:
        ValueError: If quiz not found
    """
    quiz = quiz_accessor.get_quiz_by_id(db, quiz_id, load_questions=True)
    
    if not quiz:
        raise ValueError("Quiz not found")
    
    return QuizResponse.model_validate(quiz)


def get_quiz_for_public(db: Session, quiz_id: UUID) -> QuizPublic:
    """
    Get quiz without answers (public view).
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        
    Returns:
        QuizPublic schema
        
    Raises:
        ValueError: If quiz not found or inactive
    """
    quiz = quiz_accessor.get_quiz_by_id(db, quiz_id, load_questions=True)
    
    if not quiz:
        raise ValueError("Quiz not found")
    
    if not quiz.is_active:
        raise ValueError("Quiz is not active")
    
    return QuizPublic.model_validate(quiz)


def list_quizzes_for_admin(
    db: Session,
    admin_id: UUID,
    skip: int = 0,
    limit: int = 100
) -> List[QuizListItem]:
    """
    List quizzes for admin with summary information.
    
    Args:
        db: Database session
        admin_id: Admin UUID
        skip: Pagination offset
        limit: Pagination limit
        
    Returns:
        List of QuizListItem schemas
    """
    quizzes = quiz_accessor.list_quizzes(
        db,
        admin_id=admin_id,
        skip=skip,
        limit=limit
    )
    
    # Convert to list items with question count
    result = []
    for quiz in quizzes:
        item = QuizListItem(
            id=quiz.id,
            title=quiz.title,
            description=quiz.description,
            is_active=quiz.is_active,
            created_at=quiz.created_at,
            question_count=len(quiz.questions)
        )
        result.append(item)
    
    return result


def list_active_quizzes_for_public(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[QuizListItem]:
    """
    List active quizzes for public view.
    
    Args:
        db: Database session
        skip: Pagination offset
        limit: Pagination limit
        
    Returns:
        List of QuizListItem schemas
    """
    quizzes = quiz_accessor.list_quizzes(
        db,
        is_active=True,
        skip=skip,
        limit=limit
    )
    
    # Convert to list items
    result = []
    for quiz in quizzes:
        item = QuizListItem(
            id=quiz.id,
            title=quiz.title,
            description=quiz.description,
            is_active=quiz.is_active,
            created_at=quiz.created_at,
            question_count=len(quiz.questions)
        )
        result.append(item)
    
    return result


def update_quiz_details(
    db: Session,
    quiz_id: UUID,
    quiz_data: QuizUpdate,
    admin_id: UUID
) -> QuizResponse:
    """
    Update quiz details (verify ownership).
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        quiz_data: Quiz update data
        admin_id: Admin UUID
        
    Returns:
        QuizResponse schema
        
    Raises:
        ValueError: If quiz not found or unauthorized
    """
    # Verify quiz exists and belongs to admin
    quiz = quiz_accessor.get_quiz_by_id(db, quiz_id, load_questions=False)
    
    if not quiz:
        raise ValueError("Quiz not found")
    
    if quiz.admin_id != admin_id:
        raise ValueError("Unauthorized to update this quiz")
    
    # Update quiz
    updated_quiz = quiz_accessor.update_quiz(db, quiz_id, quiz_data)
    
    return QuizResponse.model_validate(updated_quiz)


def delete_quiz_by_id(db: Session, quiz_id: UUID, admin_id: UUID) -> bool:
    """
    Delete quiz (verify ownership).
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        admin_id: Admin UUID
        
    Returns:
        True if deleted
        
    Raises:
        ValueError: If quiz not found or unauthorized
    """
    # Verify quiz exists and belongs to admin
    quiz = quiz_accessor.get_quiz_by_id(db, quiz_id, load_questions=False)
    
    if not quiz:
        raise ValueError("Quiz not found")
    
    if quiz.admin_id != admin_id:
        raise ValueError("Unauthorized to delete this quiz")
    
    return quiz_accessor.delete_quiz(db, quiz_id)
