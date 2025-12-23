from sqlalchemy.orm import Session, joinedload
from typing import Dict, List
from uuid import UUID
from app.models.submission import QuizSubmission
from app.models.quiz import Quiz
from app.models.question import Question, QuestionType
from app.models.user import User
from app.schemas.submission import QuestionResult


def create_submission_record(
    db: Session,
    quiz_id: UUID,
    user_id: UUID,
    score: int,
    total_questions: int
) -> QuizSubmission:
    """
    Create a quiz submission record with final score.
    
    Args:
        db: Database session
        quiz_id: Quiz UUID
        user_id: User UUID
        score: Number of correct answers
        total_questions: Total number of questions
        
    Returns:
        Created QuizSubmission instance
    """
    submission = QuizSubmission(
        quiz_id=quiz_id,
        user_id=user_id,
        score=score,
        total_questions=total_questions
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return submission


def calculate_score(
    quiz: Quiz,
    user_answers: Dict[str, str]
) -> tuple[int, List[QuestionResult]]:
    """
    Calculate quiz score by comparing user answers with correct answers.
    Returns score and detailed results without storing user answers.
    
    Args:
        quiz: Quiz instance with loaded questions and answers
        user_answers: Dictionary mapping question_id (as string) to user answer
        
    Returns:
        Tuple of (score, list of question results)
    """
    score = 0
    results = []
    
    for question in quiz.questions:
        question_id_str = str(question.id)
        user_answer = user_answers.get(question_id_str, "").strip()
        
        # Get correct answer
        correct_answer = question.answer.correct_answer if question.answer else ""
        explanation = question.answer.explanation if question.answer else None
        
        # Check if answer is correct based on question type
        is_correct = check_answer_correctness(
            question.question_type,
            user_answer,
            correct_answer
        )
        
        if is_correct:
            score += 1
        
        # Create result object (not stored in DB)
        result = QuestionResult(
            question_id=question.id,
            question_text=question.question_text,
            user_answer=user_answer,
            correct_answer=correct_answer,
            is_correct=is_correct,
            explanation=explanation
        )
        results.append(result)
    
    return score, results


def check_answer_correctness(
    question_type: QuestionType,
    user_answer: str,
    correct_answer: str
) -> bool:
    """
    Check if user answer is correct based on question type.
    
    Args:
        question_type: Type of question
        user_answer: User's answer
        correct_answer: Correct answer
        
    Returns:
        True if answer is correct, False otherwise
    """
    if not user_answer:
        return False
    
    # Normalize answers for comparison
    user_answer_normalized = user_answer.strip().lower()
    correct_answer_normalized = correct_answer.strip().lower()
    
    if question_type == QuestionType.MCQ:
        # For MCQ, compare option keys (case-insensitive)
        return user_answer_normalized == correct_answer_normalized
    
    elif question_type == QuestionType.TRUE_FALSE:
        # For True/False, compare boolean values
        return user_answer_normalized == correct_answer_normalized
    
    elif question_type == QuestionType.TEXT:
        # For text, exact match (case-insensitive)
        # Could be enhanced with fuzzy matching or keyword matching
        return user_answer_normalized == correct_answer_normalized
    
    return False


def get_submission_by_id(db: Session, submission_id: UUID) -> QuizSubmission:
    """
    Get submission by ID with related data.
    
    Args:
        db: Database session
        submission_id: Submission UUID
        
    Returns:
        QuizSubmission instance or None
    """
    return db.query(QuizSubmission).filter(
        QuizSubmission.id == submission_id
    ).first()
