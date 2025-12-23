from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from app.models.user import User


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Get user by email.
    
    Args:
        db: Database session
        email: User email
        
    Returns:
        User instance or None
    """
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    """
    Get user by ID.
    
    Args:
        db: Database session
        user_id: User UUID
        
    Returns:
        User instance or None
    """
    return db.query(User).filter(User.id == user_id).first()


def create_or_get_user(db: Session, email: str) -> User:
    """
    Create a new user or get existing user by email (idempotent operation).
    
    Args:
        db: Database session
        email: User email
        
    Returns:
        User instance (existing or newly created)
    """
    # Check if user already exists
    existing_user = get_user_by_email(db, email)
    if existing_user:
        return existing_user
    
    # Create new user
    user = User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user
