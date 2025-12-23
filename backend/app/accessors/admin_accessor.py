from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from app.models.admin import Admin
from app.core.security import get_password_hash, verify_password


def get_admin_by_id(db: Session, admin_id: str) -> Optional[Admin]:
    """
    Get admin by ID.
    
    Args:
        db: Database session
        admin_id: Admin UUID
        
    Returns:
        Admin instance or None
    """
    return db.query(Admin).filter(Admin.id == admin_id).first()


def get_admin_by_email(db: Session, email: str) -> Optional[Admin]:
    """
    Get admin by email.
    
    Args:
        db: Database session
        email: Admin email
        
    Returns:
        Admin instance or None
    """
    return db.query(Admin).filter(Admin.email == email).first()


def create_admin(db: Session, email: str, password: str) -> Admin:
    """
    Create a new admin with hashed password.
    
    Args:
        db: Database session
        email: Admin email
        password: Plain text password
        
    Returns:
        Created Admin instance
        
    Raises:
        ValueError: If email already exists
    """
    # Check if admin already exists
    existing_admin = get_admin_by_email(db, email)
    if existing_admin:
        raise ValueError("Email already registered")
    
    # Create admin with hashed password
    hashed_password = get_password_hash(password)
    admin = Admin(
        email=email,
        hashed_password=hashed_password
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    return admin


def authenticate_admin(db: Session, email: str, password: str) -> Optional[Admin]:
    """
    Authenticate admin by email and password.
    
    Args:
        db: Database session
        email: Admin email
        password: Plain text password
        
    Returns:
        Admin instance if authenticated, None otherwise
    """
    admin = get_admin_by_email(db, email)
    if not admin:
        return None
    
    if not verify_password(password, admin.hashed_password):
        return None
    
    return admin
