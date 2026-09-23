from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .db import get_db
from .deps import current_user
from .models import AuditEvent, AuditEventType, Profile
from .schemas import ProfileIn

router = APIRouter(prefix="/api/v1/profiles", tags=["profiles"])


def calculate_completeness(payload: ProfileIn) -> int:
    checks = [
        bool(payload.display_name),
        bool(payload.date_of_birth),
        bool(payload.gender),
        bool(payload.marital_status),
        bool(payload.location),
        bool(payload.education),
        bool(payload.profession),
        bool(payload.bio),
        bool(payload.interests),
        bool(payload.lifestyle),
        bool(payload.values),
        payload.preferred_age_min is not None and payload.preferred_age_max is not None,
    ]
    return round(sum(checks) / len(checks) * 100)


def serialize_profile(p: Profile) -> dict:
    metadata = p.ai_metadata or {}
    preferences = metadata.get("preferences", {})
    return {
        "id": str(p.id),
        "user_id": str(p.user_id),
        "display_name": p.display_name,
        "date_of_birth": p.date_of_birth.isoformat() if p.date_of_birth else None,
        "gender": p.gender,
        "marital_status": p.marital_status,
        "location": p.location,
        "education": p.education,
        "profession": p.profession,
        "bio": p.bio,
        "wants_children": p.wants_children,
        "children_count": p.children_count,
        "profile_complete_pct": p.profile_complete_pct,
        "interests": metadata.get("interests", []),
        "lifestyle": metadata.get("lifestyle", []),
        "values": metadata.get("values", []),
        "preferred_age_min": preferences.get("age_min"),
        "preferred_age_max": preferences.get("age_max"),
        "preferred_gender": preferences.get("gender"),
        "preferred_location": preferences.get("location"),
    }


@router.get("/me")
def get_me(user=Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(Profile).filter(Profile.user_id == user.id).first()
    return serialize_profile(p) if p else {"user_id": str(user.id), "complete": False, "profile_complete_pct": 0}


@router.put("/me")
def save_me(payload: ProfileIn, user=Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not p:
        p = Profile(user_id=user.id)
        db.add(p)

    p.display_name = payload.display_name
    p.date_of_birth = payload.date_of_birth
    p.gender = payload.gender
    p.marital_status = payload.marital_status
    p.location = payload.location
    p.education = payload.education
    p.profession = payload.profession
    p.bio = payload.bio
    p.wants_children = payload.wants_children
    p.children_count = payload.children_count
    p.profile_complete_pct = calculate_completeness(payload)
    p.ai_metadata = {
        "interests": payload.interests,
        "lifestyle": payload.lifestyle,
        "values": payload.values,
        "preferences": {
            "age_min": payload.preferred_age_min,
            "age_max": payload.preferred_age_max,
            "gender": payload.preferred_gender,
            "location": payload.preferred_location,
        },
    }
    db.add(AuditEvent(user_id=user.id, event_type=AuditEventType.PROFILE_UPDATED, target_type="profile", target_id=str(p.id)))
    db.commit()
    db.refresh(p)
    return serialize_profile(p)
