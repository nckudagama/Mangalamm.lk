from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .db import get_db
from .deps import current_user
from .models import Profile, User, Visibility
from .services_matching import calculate_match, MatchingWeights

router = APIRouter(prefix="/api/v1/matching", tags=["matching"])


def age_on(dob):
    if not dob:
        return None
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def public_profile(p: Profile) -> dict:
    return {
        "id": str(p.id),
        "user_id": str(p.user_id),
        "display_name": p.display_name,
        "age": age_on(p.date_of_birth),
        "gender": p.gender,
        "marital_status": p.marital_status,
        "location": p.location,
        "education": p.education,
        "profession": p.profession,
        "bio": p.bio,
        "profile_complete_pct": p.profile_complete_pct,
        "photos": [],
    }


def weights_from_query(ai_weight: int, astrology_weight: int) -> MatchingWeights:
    return MatchingWeights(ai=max(0, ai_weight), astrology=max(0, astrology_weight))


def get_candidate(profile_id: str, db: Session) -> Profile:
    candidate = (
        db.query(Profile)
        .join(User, User.id == Profile.user_id)
        .filter(Profile.id == profile_id, User.is_active.is_(True))
        .first()
    )
    if not candidate or candidate.visibility != Visibility.PUBLIC:
        raise HTTPException(status_code=404, detail="Profile not available")
    return candidate


@router.get("/profiles/{profile_id}")
def profile_with_match(
    profile_id: str,
    ai_weight: int = Query(60, ge=0, le=100),
    astrology_weight: int = Query(40, ge=0, le=100),
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    seeker = db.query(Profile).filter(Profile.user_id == user.id).first()
    candidate = get_candidate(profile_id, db)
    if not seeker:
        raise HTTPException(status_code=404, detail="Your profile is not available")
    return {
        "profile": public_profile(candidate),
        "matching": calculate_match(seeker, candidate, weights_from_query(ai_weight, astrology_weight)),
    }


@router.get("/preview/{profile_id}")
def matching_preview(
    profile_id: str,
    ai_weight: int = Query(60, ge=0, le=100),
    astrology_weight: int = Query(40, ge=0, le=100),
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    seeker = db.query(Profile).filter(Profile.user_id == user.id).first()
    candidate = get_candidate(profile_id, db)
    if not seeker:
        raise HTTPException(status_code=404, detail="Your profile is not available")
    return calculate_match(seeker, candidate, weights_from_query(ai_weight, astrology_weight))
