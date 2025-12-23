from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.accessors import user_accessor

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user_email(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register user email (no authentication required).
    This is idempotent - returns existing user if email already registered.
    
    Args:
        user_data: User data with email
        db: Database session
        
    Returns:
        User information
    """
    user = user_accessor.create_or_get_user(db, user_data.email)
    return UserResponse.model_validate(user)
