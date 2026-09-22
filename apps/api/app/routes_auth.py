from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .core.security import (
    REFRESH_DAYS,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    token_hash,
    verify_password,
)
from .db import get_db
from .deps import current_user
from .models import AuditEvent, AuditEventType, RefreshSession, User
from .schemas import LoginIn, RefreshIn, RegisterIn, TokenOut

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


def issue_session(user_id, db: Session) -> TokenOut:
    session = RefreshSession(
        user_id=user_id,
        token_hash="pending",
        expires_at=datetime.now(timezone.utc) + timedelta(days=REFRESH_DAYS),
    )
    db.add(session)
    db.flush()
    refresh_token = create_refresh_token(str(user_id), str(session.id))
    session.token_hash = token_hash(refresh_token)
    access_token = create_access_token(str(user_id))
    return TokenOut(access_token=access_token, refresh_token=refresh_token)


@router.post("/register", response_model=TokenOut)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(409, "Email already registered")
    if payload.phone and db.query(User).filter(User.phone == payload.phone).first():
        raise HTTPException(409, "Phone already registered")
    user = User(email=payload.email, phone=payload.phone, password_hash=hash_password(payload.password))
    db.add(user)
    db.flush()
    tokens = issue_session(user.id, db)
    db.add(AuditEvent(user_id=user.id, event_type=AuditEventType.LOGIN, metadata_json={"method": "register"}))
    db.commit()
    return tokens


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")
    tokens = issue_session(user.id, db)
    db.add(AuditEvent(user_id=user.id, event_type=AuditEventType.LOGIN, metadata_json={"method": "password"}))
    db.commit()
    return tokens


@router.post("/refresh", response_model=TokenOut)
def refresh(payload: RefreshIn, db: Session = Depends(get_db)):
    try:
        data = decode_refresh_token(payload.refresh_token)
        user_id = data["sub"]
        session_id = data["jti"]
    except (jwt.PyJWTError, KeyError):
        raise HTTPException(401, "Invalid or expired refresh token")

    session = db.get(RefreshSession, session_id)
    if (
        not session
        or str(session.user_id) != str(user_id)
        or session.revoked_at is not None
        or session.expires_at <= datetime.now(timezone.utc)
        or session.token_hash != token_hash(payload.refresh_token)
    ):
        raise HTTPException(401, "Refresh session is invalid or revoked")

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(401, "Account unavailable")

    session.revoked_at = datetime.now(timezone.utc)
    tokens = issue_session(user.id, db)
    db.commit()
    return tokens


@router.post("/logout")
def logout(user=Depends(current_user), db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    db.query(RefreshSession).filter(
        RefreshSession.user_id == user.id,
        RefreshSession.revoked_at.is_(None),
    ).update({"revoked_at": now}, synchronize_session=False)
    db.add(AuditEvent(user_id=user.id, event_type=AuditEventType.LOGOUT))
    db.commit()
    return {"ok": True}


@router.get("/me")
def me(user=Depends(current_user)):
    return {"id": str(user.id), "email": user.email, "phone": user.phone, "role": user.role}
