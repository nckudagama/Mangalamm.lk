from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from .db import get_db
from .deps import current_user
from .models import Profile
from .schemas import ProfileIn
router=APIRouter(prefix="/api/v1/profiles",tags=["profiles"])
@router.get("/me")
def get_me(user=Depends(current_user),db:Session=Depends(get_db)):
    p=db.query(Profile).filter(Profile.user_id==user.id).first(); return p.__dict__ if p else {"user_id":str(user.id),"complete":False}
@router.put("/me")
def save_me(payload:ProfileIn,user=Depends(current_user),db:Session=Depends(get_db)):
    p=db.query(Profile).filter(Profile.user_id==user.id).first()
    if not p: p=Profile(user_id=user.id); db.add(p)
    for k,v in payload.model_dump().items():
        if hasattr(p,k): setattr(p,k,v)
    p.ai_metadata={"interests":payload.interests,"lifestyle":payload.lifestyle,"values":payload.values,"preferences":{"age_min":payload.preferred_age_min,"age_max":payload.preferred_age_max}}
    db.commit(); db.refresh(p); return {"id":str(p.id),"complete":True}
