from sqlalchemy.orm import Session
from datetime import timedelta
from app.accessors import admin_accessor
from app.core.security import create_access_token
from app.core.config import settings
from app.schemas.admin import AdminCreate, AdminResponse, Token
from app.models.admin import Admin


def register_admin(db: Session, admin_data: AdminCreate) -> AdminResponse:
    """
    Register a new admin.
    
    Args:
        db: Database session
        admin_data: Admin registration data
        
    Returns:
        AdminResponse schema
        
    Raises:
        ValueError: If email already exists
    """
    admin = admin_accessor.create_admin(
        db=db,
        email=admin_data.email,
        password=admin_data.password
    )
    
    return AdminResponse.model_validate(admin)


def login_admin(db: Session, email: str, password: str) -> Token:
    """
    Authenticate admin and return JWT token.
    
    Args:
        db: Database session
        email: Admin email
        password: Admin password
        
    Returns:
        Token schema with access token
        
    Raises:
        ValueError: If authentication fails
    """
    admin = admin_accessor.authenticate_admin(db, email, password)
    
    if not admin:
        raise ValueError("Incorrect email or password")
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(admin.id)},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")


def get_current_admin_info(admin: Admin) -> AdminResponse:
    """
    Get current admin information.
    
    Args:
        admin: Admin model instance
        
    Returns:
        AdminResponse schema
    """
    return AdminResponse.model_validate(admin)
