from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_admin
from app.schemas.admin import AdminCreate, AdminResponse, Token
from app.services import auth_service
from app.models.admin import Admin

router = APIRouter(prefix="/api/auth/admin", tags=["Admin Authentication"])


@router.post("/register", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
def register_admin(
    admin_data: AdminCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new admin account.
    
    Args:
        admin_data: Admin registration data (email and password)
        db: Database session
        
    Returns:
        Created admin information
        
    Raises:
        HTTPException: If email already exists
    """
    try:
        return auth_service.register_admin(db, admin_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Token)
def login_admin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Admin login endpoint (OAuth2 password flow).
    
    Args:
        form_data: OAuth2 form with username (email) and password
        db: Database session
        
    Returns:
        JWT access token
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        return auth_service.login_admin(db, form_data.username, form_data.password)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get("/me", response_model=AdminResponse)
def get_current_admin_info(
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get current authenticated admin information.
    
    Args:
        current_admin: Current admin from JWT token
        
    Returns:
        Admin information
    """
    return auth_service.get_current_admin_info(current_admin)
