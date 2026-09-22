from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from .db import get_db
from .deps import current_user
from sqlalchemy import text
from datetime import datetime,timezone
from .models import Consent
from .schemas import ConsentIn
router=APIRouter(prefix="/api/v1/consent",tags=["consent"])
@router.post("")
def set_consent(payload:ConsentIn,user=Depends(current_user),db:Session=Depends(get_db)):
    c=Consent(user_id=user.id,consent_type=payload.consent_type,granted=payload.granted,version=payload.version,created_at=datetime.now(timezone.utc)); db.add(c); db.commit(); return {"status":"recorded"}
@router.get("")
def list_consent(user=Depends(current_user),db:Session=Depends(get_db)):
    return [{"type":c.consent_type,"granted":c.granted,"version":c.version,"created_at":c.created_at} for c in db.query(Consent).filter(Consent.user_id==user.id).order_by(Consent.created_at.desc()).all()]
