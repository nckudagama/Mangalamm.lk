import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .db import get_db
from .deps import current_user
from .models import AuditEvent, AuditEventType, Interest, InterestStatus, Match, MatchStatus, Profile
from .schemas import InterestIn

router = APIRouter(prefix="/api/v1/interests", tags=["interests"])


def canonical_pair(a, b):
    return (a, b) if str(a) < str(b) else (b, a)


@router.post("")
def send_interest(payload: InterestIn, user=Depends(current_user), db: Session = Depends(get_db)):
    try:
        target_profile_id = uuid.UUID(payload.profile_id)
    except ValueError:
        raise HTTPException(400, "Invalid profile id")

    target = db.get(Profile, target_profile_id)
    if not target or target.user_id == user.id:
        raise HTTPException(404, "Profile not available")

    existing = db.query(Interest).filter(
        Interest.from_user_id == user.id,
        Interest.to_user_id == target.user_id,
    ).first()
    if existing:
        return {"id": str(existing.id), "status": existing.status.value, "matched": existing.status == InterestStatus.MUTUAL}

    reciprocal = db.query(Interest).filter(
        Interest.from_user_id == target.user_id,
        Interest.to_user_id == user.id,
    ).first()

    interest = Interest(
        from_user_id=user.id,
        to_user_id=target.user_id,
        status=InterestStatus.MUTUAL if reciprocal else InterestStatus.PENDING,
    )
    db.add(interest)

    matched = False
    if reciprocal:
        reciprocal.status = InterestStatus.MUTUAL
        a, b = canonical_pair(user.id, target.user_id)
        match = db.query(Match).filter(Match.user_a_id == a, Match.user_b_id == b).first()
        if not match:
            match = Match(user_a_id=a, user_b_id=b, status=MatchStatus.ACTIVE, compatibility_algorithm_version="foundation-v1")
            db.add(match)
        matched = True

    db.add(AuditEvent(
        user_id=user.id,
        event_type=AuditEventType.MATCHING_PROFILE_ACCESSED,
        target_type="profile",
        target_id=str(target.id),
        metadata_json={"action": "interest", "mutual": matched},
    ))
    db.commit()
    db.refresh(interest)
    return {"id": str(interest.id), "status": interest.status.value, "matched": matched}


@router.get("")
def list_interests(user=Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Interest).filter(
        or_(Interest.from_user_id == user.id, Interest.to_user_id == user.id)
    ).order_by(Interest.created_at.desc()).limit(100).all()
    return [
        {
            "id": str(row.id),
            "direction": "sent" if row.from_user_id == user.id else "received",
            "user_id": str(row.to_user_id if row.from_user_id == user.id else row.from_user_id),
            "status": row.status.value,
            "created_at": row.created_at.isoformat(),
        }
        for row in rows
    ]


@router.get("/matches")
def list_matches(user=Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Match).filter(
        or_(Match.user_a_id == user.id, Match.user_b_id == user.id),
        Match.status == MatchStatus.ACTIVE,
    ).order_by(Match.created_at.desc()).all()
    return [
        {
            "id": str(row.id),
            "user_id": str(row.user_b_id if row.user_a_id == user.id else row.user_a_id),
            "algorithm_version": row.compatibility_algorithm_version,
            "created_at": row.created_at.isoformat(),
        }
        for row in rows
    ]
