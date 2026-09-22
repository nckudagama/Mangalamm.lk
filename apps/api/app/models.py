import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
class Base(DeclarativeBase): pass
class Role(str,Enum): USER="USER"; ADMIN="ADMIN"; SUPER_ADMIN="SUPER_ADMIN"; RESEARCHER="RESEARCHER"
class Visibility(str,Enum): PRIVATE="PRIVATE"; AI_ONLY="AI_ONLY"; MATCH_ONLY="MATCH_ONLY"; MUTUAL_MATCH="MUTUAL_MATCH"; PUBLIC="PUBLIC"; ADMIN_RESTRICTED="ADMIN_RESTRICTED"
class User(Base):
 __tablename__="users"; id:Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4); email:Mapped[str|None]=mapped_column(String(320),unique=True); phone:Mapped[str|None]=mapped_column(String(32),unique=True); password_hash:Mapped[str|None]=mapped_column(Text()); role:Mapped[Role]=mapped_column(SAEnum(Role),default=Role.USER); is_active:Mapped[bool]=mapped_column(Boolean,default=True); created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now()); updated_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
class Profile(Base):
 __tablename__="profiles"; id:Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4); user_id:Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),ForeignKey("users.id",ondelete="CASCADE"),unique=True); display_name:Mapped[str|None]=mapped_column(String(120)); gender:Mapped[str|None]=mapped_column(String(40)); location:Mapped[str|None]=mapped_column(String(120)); education:Mapped[str|None]=mapped_column(String(200)); profession:Mapped[str|None]=mapped_column(String(200)); bio:Mapped[str|None]=mapped_column(Text()); visibility:Mapped[Visibility]=mapped_column(SAEnum(Visibility),default=Visibility.MATCH_ONLY); created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now()); updated_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
