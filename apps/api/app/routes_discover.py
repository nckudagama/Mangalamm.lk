from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from .db import get_db
from .deps import current_user
from .models import Profile, User
router=APIRouter(prefix="/api/v1/discover",tags=["discover"])
@router.get("")
def discover(user=Depends(current_user),db:Session=Depends(get_db),location:str|None=None,gender:str|None=None,limit:int=Query(20,ge=1,le=50)):
 q=db.query(Profile).join(User,User.id==Profile.user_id).filter(Profile.user_id!=user.id,User.is_active.is_(True))
 if location:q=q.filter(Profile.location.ilike(f"%{location}%"))
 if gender:q=q.filter(Profile.gender==gender)
 return [{"id":str(p.id),"user_id":str(p.user_id),"display_name":p.display_name,"gender":p.gender,"location":p.location,"education":p.education,"profession":p.profession,"bio":p.bio} for p in q.limit(limit).all()]
