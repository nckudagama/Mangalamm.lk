from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from .db import get_db
from .models import User
from .schemas import RegisterIn,LoginIn,TokenOut
from .core.security import hash_password,verify_password,create_access_token,create_refresh_token
router=APIRouter(prefix="/api/v1/auth",tags=["auth"])
@router.post("/register",response_model=TokenOut)
def register(payload:RegisterIn,db:Session=Depends(get_db)):
    if db.query(User).filter(User.email==payload.email).first(): raise HTTPException(409,"Email already registered")
    user=User(email=payload.email,phone=payload.phone,password_hash=hash_password(payload.password)); db.add(user); db.commit(); db.refresh(user)
    return TokenOut(access_token=create_access_token(str(user.id)),refresh_token=create_refresh_token(str(user.id)))
@router.post("/login",response_model=TokenOut)
def login(payload:LoginIn,db:Session=Depends(get_db)):
    user=db.query(User).filter(User.email==payload.email).first()
    if not user or not user.password_hash or not verify_password(payload.password,user.password_hash): raise HTTPException(401,"Invalid email or password")
    return TokenOut(access_token=create_access_token(str(user.id)),refresh_token=create_refresh_token(str(user.id)))
@router.get("/me")
def me(user=Depends(__import__("app.deps",fromlist=["current_user"]).current_user)): return {"id":str(user.id),"email":user.email,"phone":user.phone,"role":user.role}
