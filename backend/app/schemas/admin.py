from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID


class AdminBase(BaseModel):
    """Base schema for Admin."""
    email: EmailStr


class AdminCreate(AdminBase):
    """Schema for creating an admin."""
    password: str


class AdminLogin(BaseModel):
    """Schema for admin login."""
    email: EmailStr
    password: str


class AdminResponse(AdminBase):
    """Schema for admin response."""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token payload data."""
    email: str | None = None
