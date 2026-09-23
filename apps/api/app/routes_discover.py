from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .db import get_db
from .deps import current_user
from .models import Profile, User, Visibility

router = APIRouter(prefix="/api/v1/discover", tags=["discover"])


def age_on(dob: date | None) -> int | None:
    if not dob:
        return None
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def date_for_age(age: int, add: int) -> date:
    year = date.today().year - age + add
    return date(year, date.today().month, min(date.today().day, 28))


@router.get("")
def discover(
    user=Depends(current_user),
    db: Session = Depends(get_db),
    location: str | None = None,
    gender: str | None = None,
    age_min: int | None = Query(default=None, ge=18, le=100),
    age_max: int | None = Query(default=None, ge=18, le=100),
    limit: int = Query(20, ge=1, le=50),
):
    q = (
        db.query(Profile)
        .join(User, User.id == Profile.user_id)
        .filter(Profile.user_id != user.id, User.is_active.is_(True))
        .filter(Profile.visibility == Visibility.PUBLIC)
    )
    if location:
        q = q.filter(Profile.location.ilike(f"%{location}%"))
    if gender:
        q = q.filter(Profile.gender == gender)

    # Respect the signed-in member's saved partner preference when available.
    own = db.query(Profile).filter(Profile.user_id == user.id).first()
    if own and not gender:
        own_meta = own.ai_metadata or {}
        preferred_gender = own_meta.get("preferences", {}).get("gender")
        if preferred_gender:
            q = q.filter(Profile.gender == preferred_gender)
    if age_min is not None:
        q = q.filter(Profile.date_of_birth <= date_for_age(age_min, 0))
    if age_max is not None:
        q = q.filter(Profile.date_of_birth >= date_for_age(age_max, 0))

    rows = q.order_by(Profile.updated_at.desc()).limit(limit).all()
    return [
        {
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
        }
        for p in rows
    ]
