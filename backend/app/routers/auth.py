from fastapi import APIRouter, HTTPException, status

from app.schemas.auth import LoginRequest
from app.services.auth_service import authenticate_user

router = APIRouter()


@router.post("/login")
def login(request: LoginRequest):
    if authenticate_user(request.username, request.password):
        return {"success": True, "message": "Login successful"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password",
    )
