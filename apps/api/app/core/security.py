import hashlib
import os
import uuid
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()
JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET", "change-me")
ACCESS_MINUTES = 30
REFRESH_DAYS = 30


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return password_hash.verify(password, hashed)


def create_access_token(sub: str) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode({"sub": sub, "type": "access", "exp": now + timedelta(minutes=ACCESS_MINUTES)}, JWT_SECRET, algorithm="HS256")


def create_refresh_token(sub: str, jti: str | None = None) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"sub": sub, "type": "refresh", "jti": jti or str(uuid.uuid4()), "exp": now + timedelta(days=REFRESH_DAYS)},
        JWT_REFRESH_SECRET,
        algorithm="HS256",
    )


def decode_access_token(token: str) -> dict:
    data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    if data.get("type") != "access":
        raise jwt.InvalidTokenError("wrong token type")
    return data


def decode_refresh_token(token: str) -> dict:
    data = jwt.decode(token, JWT_REFRESH_SECRET, algorithms=["HS256"])
    if data.get("type") != "refresh":
        raise jwt.InvalidTokenError("wrong token type")
    return data


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
