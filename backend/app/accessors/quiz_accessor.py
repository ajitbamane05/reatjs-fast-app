from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from uuid import UUID
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.answer import Answer
from app.schemas.quiz import QuizCreate, QuizUpdate


def get_quiz_by_id(db: Session, quiz_id: UUID, load_questions: bool = True) -> Optional[Quiz]:
    """
    Get quiz by ID.
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        load_questions: Whether to eagerly load questions and answers
        
    Returns:
        Quiz instance or None
    """
    query = db.query(Quiz).filter(Quiz.id == quiz_id)
    
    if load_questions:
        query = query.options(
            joinedload(Quiz.questions).joinedload(Question.answer)
        )
    
    return query.first()


def list_quizzes(
    db: Session,
    admin_id: Optional[UUID] = None,
    is_active: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Quiz]:
    """
    List quizzes with optional filtering.
    
    Args:
        db: Database session
        admin_id: Filter by admin ID
        is_active: Filter by active status
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of Quiz instances
    """
    query = db.query(Quiz)
    
    if admin_id:
        query = query.filter(Quiz.admin_id == admin_id)
    
    if is_active is not None:
        query = query.filter(Quiz.is_active == is_active)
    
    return query.offset(skip).limit(limit).all()


def create_quiz(db: Session, quiz_data: QuizCreate, admin_id: UUID) -> Quiz:
    """
    Create a new quiz with questions and answers.
    
    Args:
        db: Database session
        quiz_data: Quiz creation data
        admin_id: Admin UUID creating the quiz
        
    Returns:
        Created Quiz instance
        
    Raises:
        ValueError: If quiz data is invalid
    """
    # Validate quiz structure
    validate_quiz_structure(quiz_data)
    
    # Create quiz
    quiz = Quiz(
        title=quiz_data.title,
        description=quiz_data.description,
        admin_id=admin_id,
        is_active=quiz_data.is_active
    )
    db.add(quiz)
    db.flush()  # Get quiz ID without committing
    
    # Create questions and answers
    for question_data in quiz_data.questions:
        question = Question(
            quiz_id=quiz.id,
            question_type=question_data.question_type,
            question_text=question_data.question_text,
            options=question_data.options,
            order=question_data.order
        )
        db.add(question)
        db.flush()  # Get question ID
        
        # Create answer
        answer = Answer(
            question_id=question.id,
            correct_answer=question_data.answer.correct_answer,
            explanation=question_data.answer.explanation
        )
        db.add(answer)
    
    db.commit()
    db.refresh(quiz)
    
    return quiz


def update_quiz(db: Session, quiz_id: UUID, quiz_data: QuizUpdate) -> Optional[Quiz]:
    """
    Update quiz details (not questions).
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        quiz_data: Quiz update data
        
    Returns:
        Updated Quiz instance or None if not found
    """
    quiz = get_quiz_by_id(db, quiz_id, load_questions=False)
    if not quiz:
        return None
    
    # Update only provided fields
    update_data = quiz_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(quiz, field, value)
    
    db.commit()
    db.refresh(quiz)
    
    return quiz


def delete_quiz(db: Session, quiz_id: UUID) -> bool:
    """
    Delete a quiz (hard delete).
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        
    Returns:
        True if deleted, False if not found
    """
    quiz = get_quiz_by_id(db, quiz_id, load_questions=False)
    if not quiz:
        return False
    
    db.delete(quiz)
    db.commit()
    
    return True


def validate_quiz_structure(quiz_data: QuizCreate) -> None:
    """
    Validate quiz structure and business rules.
    
    Args:
        quiz_data: Quiz creation data
        
    Raises:
        ValueError: If validation fails
    """
    # Check for duplicate question orders
    orders = [q.order for q in quiz_data.questions]
    if len(orders) != len(set(orders)):
        raise ValueError("Duplicate question orders found")
    
    # Validate each question
    for question in quiz_data.questions:
        # MCQ must have options
        if question.question_type == "mcq" and not question.options:
            raise ValueError(f"MCQ question at order {question.order} must have options")
        
        # MCQ answer must be one of the option keys
        if question.question_type == "mcq" and question.options:
            if question.answer.correct_answer not in question.options:
                raise ValueError(
                    f"MCQ question at order {question.order}: "
                    f"correct answer must be one of the option keys"
                )
        
        # True/False must have valid answer
        if question.question_type == "true_false":
            if question.answer.correct_answer.lower() not in ["true", "false"]:
                raise ValueError(
                    f"True/False question at order {question.order}: "
                    f"answer must be 'true' or 'false'"
                )
