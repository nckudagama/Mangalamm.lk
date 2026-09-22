from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
revision="0001_initial"; down_revision=None; branch_labels=None; depends_on=None
role=sa.Enum("USER","ADMIN","SUPER_ADMIN","RESEARCHER",name="role"); visibility=sa.Enum("PRIVATE","AI_ONLY","MATCH_ONLY","MUTUAL_MATCH","PUBLIC","ADMIN_RESTRICTED",name="visibility")
def upgrade():
 role.create(op.get_bind()); visibility.create(op.get_bind())
 op.create_table("users",sa.Column("id",postgresql.UUID(as_uuid=True),primary_key=True),sa.Column("email",sa.String(320),unique=True),sa.Column("phone",sa.String(32),unique=True),sa.Column("password_hash",sa.Text()),sa.Column("role",role,nullable=False),sa.Column("is_active",sa.Boolean(),nullable=False),sa.Column("created_at",sa.DateTime(timezone=True),server_default=sa.func.now()),sa.Column("updated_at",sa.DateTime(timezone=True),server_default=sa.func.now()))
 op.create_table("profiles",sa.Column("id",postgresql.UUID(as_uuid=True),primary_key=True),sa.Column("user_id",postgresql.UUID(as_uuid=True),sa.ForeignKey("users.id",ondelete="CASCADE"),unique=True),sa.Column("display_name",sa.String(120)),sa.Column("gender",sa.String(40)),sa.Column("location",sa.String(120)),sa.Column("education",sa.String(200)),sa.Column("profession",sa.String(200)),sa.Column("bio",sa.Text()),sa.Column("visibility",visibility,nullable=False),sa.Column("created_at",sa.DateTime(timezone=True),server_default=sa.func.now()),sa.Column("updated_at",sa.DateTime(timezone=True),server_default=sa.func.now()))
def downgrade(): op.drop_table("profiles"); op.drop_table("users"); visibility.drop(op.get_bind()); role.drop(op.get_bind())
