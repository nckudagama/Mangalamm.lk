from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .db import get_db
from .deps import current_user
from .models import Conversation, ConversationMessage, Match, MatchStatus, MessageRole
from .schemas import MessageIn

router = APIRouter(prefix="/api/v1/messages", tags=["messages"])


def owns_match(match: Match, user_id) -> bool:
    return match.status == MatchStatus.ACTIVE and (match.user_a_id == user_id or match.user_b_id == user_id)


@router.get("")
def conversations(user=Depends(current_user), db: Session = Depends(get_db)):
    matches = db.query(Match).filter(
        or_(Match.user_a_id == user.id, Match.user_b_id == user.id),
        Match.status == MatchStatus.ACTIVE,
    ).order_by(Match.created_at.desc()).all()
    result = []
    for match in matches:
        other = match.user_b_id if match.user_a_id == user.id else match.user_a_id
        conversation = db.query(Conversation).filter(Conversation.match_id == match.id).first()
        last = None
        if conversation:
            last = db.query(ConversationMessage).filter(
                ConversationMessage.conversation_id == conversation.id
            ).order_by(ConversationMessage.created_at.desc()).first()
        result.append({
            "match_id": str(match.id),
            "user_id": str(other),
            "conversation_id": str(conversation.id) if conversation else None,
            "last_message": last.content if last else None,
            "last_message_at": last.created_at.isoformat() if last else None,
        })
    return result


@router.get("/{match_id}")
def messages(match_id: str, user=Depends(current_user), db: Session = Depends(get_db), limit: int = Query(100, ge=1, le=200)):
    try:
        match_uuid = UUID(match_id)
    except ValueError:
        raise HTTPException(400, "Invalid match id")
    match = db.get(Match, match_uuid)
    if not match or not owns_match(match, user.id):
        raise HTTPException(404, "Match not found")
    conversation = db.query(Conversation).filter(Conversation.match_id == match.id).first()
    if not conversation:
        return []
    rows = db.query(ConversationMessage).filter(
        ConversationMessage.conversation_id == conversation.id
    ).order_by(ConversationMessage.created_at.asc()).limit(limit).all()
    return [{"id": str(row.id), "role": row.role.value, "sender_user_id": str(row.sender_user_id) if row.sender_user_id else None, "content": row.content, "created_at": row.created_at.isoformat()} for row in rows]


@router.post("/{match_id}")
def send_message(match_id: str, payload: MessageIn, user=Depends(current_user), db: Session = Depends(get_db)):
    try:
        match_uuid = UUID(match_id)
    except ValueError:
        raise HTTPException(400, "Invalid match id")
    match = db.get(Match, match_uuid)
    if not match or not owns_match(match, user.id):
        raise HTTPException(404, "Match not found")

    conversation = db.query(Conversation).filter(Conversation.match_id == match.id).first()
    if not conversation:
        conversation = Conversation(match_id=match.id)
        db.add(conversation)
        db.flush()

    message = ConversationMessage(
        conversation_id=conversation.id,
        sender_user_id=user.id,
        role=MessageRole.USER,
        content=payload.content.strip(),
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return {"id": str(message.id), "content": message.content, "created_at": message.created_at.isoformat()}
