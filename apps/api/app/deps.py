from fastapi import Depends,HTTPException,status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from .db import get_db
from .core.security import decode_access_token
from .models import User
bearer=HTTPBearer()
def current_user(credentials=Depends(bearer),db:Session=Depends(get_db)):
    try: data=decode_access_token(credentials.credentials); uid=data["sub"]
    except Exception: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid or expired token")
    user=db.get(User,uid)
    if not user or not user.is_active: raise HTTPException(status_code=401,detail="Account unavailable")
    return user
