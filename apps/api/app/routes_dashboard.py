from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from .db import get_db
from .deps import current_user
from .models import ConversationMessage, Interest, Match, MatchStatus, Profile

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("/summary")
def dashboard_summary(user=Depends(current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()

    received_interests = db.query(func.count(Interest.id)).filter(
        Interest.to_user_id == user.id,
        Interest.status == "PENDING",
    ).scalar() or 0

    active_matches = db.query(func.count(Match.id)).filter(
        (Match.user_a_id == user.id) | (Match.user_b_id == user.id),
        Match.status == MatchStatus.ACTIVE,
    ).scalar() or 0

    sent_interests = db.query(func.count(Interest.id)).filter(
        Interest.from_user_id == user.id,
    ).scalar() or 0

    return {
        "profile_complete_pct": profile.profile_complete_pct if profile else 0,
        "received_interests": int(received_interests),
        "active_matches": int(active_matches),
        "sent_interests": int(sent_interests),
        "has_profile": profile is not None,
    }
