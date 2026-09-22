from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0003_matching_core"
down_revision = "0002_core"
branch_labels = None
depends_on = None

interest_status = sa.Enum("PENDING", "MUTUAL", "REJECTED", name="intereststatus")
match_status = sa.Enum("ACTIVE", "UNMATCHED", "BLOCKED", name="matchstatus")
message_role = sa.Enum("USER", "ASSISTANT", "SYSTEM", name="messagerole")
audit_event_type = sa.Enum(
    "LOGIN", "LOGOUT", "PROFILE_UPDATED", "CONSENT_GRANTED", "CONSENT_REVOKED",
    "MATCHING_PROFILE_ACCESSED", "PRIVATE_DATA_ACCESSED", "ADMIN_ACCESS", "AI_ANALYSIS",
    name="auditeventtype",
)


def upgrade():
    bind = op.get_bind()
    interest_status.create(bind)
    match_status.create(bind)
    message_role.create(bind)
    audit_event_type.create(bind)

    op.add_column("profiles", sa.Column("date_of_birth", sa.Date(), nullable=True))
    op.add_column("profiles", sa.Column("marital_status", sa.String(40), nullable=True))
    op.add_column("profiles", sa.Column("wants_children", sa.Boolean(), nullable=True))
    op.add_column("profiles", sa.Column("children_count", sa.Integer(), nullable=True))
    op.add_column("profiles", sa.Column("profile_complete_pct", sa.Integer(), server_default="0", nullable=False))
    op.create_index("ix_profiles_location", "profiles", ["location"])
    op.create_index("ix_profiles_gender", "profiles", ["gender"])
    op.create_index("ix_profiles_dob", "profiles", ["date_of_birth"])

    op.create_table(
        "refresh_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token_hash", sa.String(128), unique=True, nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "interests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("from_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("to_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", interest_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("from_user_id", "to_user_id", name="uq_interest_direction"),
    )
    op.create_index("ix_interests_to_user", "interests", ["to_user_id", "status"])

    op.create_table(
        "matches",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_a_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_b_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", match_status, nullable=False),
        sa.Column("compatibility_algorithm_version", sa.String(40), server_default="foundation-v1", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("user_a_id", "user_b_id", name="uq_match_pair"),
    )
    op.create_index("ix_matches_user_a", "matches", ["user_a_id", "status"])
    op.create_index("ix_matches_user_b", "matches", ["user_b_id", "status"])

    op.create_table(
        "conversations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("match_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("matches.id", ondelete="CASCADE"), unique=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "conversation_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("conversation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sender_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("role", message_role, nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("metadata_json", postgresql.JSONB(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_messages_conversation_created", "conversation_messages", ["conversation_id", "created_at"])

    op.create_table(
        "audit_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("event_type", audit_event_type, nullable=False),
        sa.Column("target_type", sa.String(80), nullable=True),
        sa.Column("target_id", sa.String(120), nullable=True),
        sa.Column("metadata_json", postgresql.JSONB(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_audit_user_created", "audit_events", ["user_id", "created_at"])


def downgrade():
    bind = op.get_bind()
    op.drop_index("ix_audit_user_created", table_name="audit_events")
    op.drop_table("audit_events")
    op.drop_index("ix_messages_conversation_created", table_name="conversation_messages")
    op.drop_table("conversation_messages")
    op.drop_table("conversations")
    op.drop_index("ix_matches_user_b", table_name="matches")
    op.drop_index("ix_matches_user_a", table_name="matches")
    op.drop_table("matches")
    op.drop_index("ix_interests_to_user", table_name="interests")
    op.drop_table("interests")
    op.drop_table("refresh_sessions")
    op.drop_index("ix_profiles_dob", table_name="profiles")
    op.drop_index("ix_profiles_gender", table_name="profiles")
    op.drop_index("ix_profiles_location", table_name="profiles")
    op.drop_column("profiles", "profile_complete_pct")
    op.drop_column("profiles", "children_count")
    op.drop_column("profiles", "wants_children")
    op.drop_column("profiles", "marital_status")
    op.drop_column("profiles", "date_of_birth")
    audit_event_type.drop(bind)
    message_role.drop(bind)
    match_status.drop(bind)
    interest_status.drop(bind)
