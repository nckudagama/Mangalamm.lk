from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
revision="0002_core"; down_revision="0001_initial"; branch_labels=None; depends_on=None
def upgrade():
    op.add_column("profiles",sa.Column("ai_metadata",postgresql.JSONB(),nullable=True))
    op.create_table("consents",sa.Column("id",postgresql.UUID(as_uuid=True),primary_key=True),sa.Column("user_id",postgresql.UUID(as_uuid=True),sa.ForeignKey("users.id",ondelete="CASCADE"),nullable=False),sa.Column("consent_type",sa.String(80),nullable=False),sa.Column("granted",sa.Boolean(),nullable=False),sa.Column("version",sa.String(40),nullable=False),sa.Column("created_at",sa.DateTime(timezone=True),server_default=sa.func.now(),nullable=False),sa.Column("revoked_at",sa.DateTime(timezone=True),nullable=True))
    op.create_index("ix_consents_user_type","consents",["user_id","consent_type"])
def downgrade():
    op.drop_index("ix_consents_user_type",table_name="consents"); op.drop_table("consents"); op.drop_column("profiles","ai_metadata")
