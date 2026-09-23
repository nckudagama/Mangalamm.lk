from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    phone: Optional[str] = Field(default=None, max_length=32)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshIn(BaseModel):
    refresh_token: str = Field(min_length=20)


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class ProfileIn(BaseModel):
    display_name: str = Field(min_length=2, max_length=120)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(default=None, max_length=40)
    marital_status: Optional[str] = Field(default=None, max_length=40)
    location: Optional[str] = Field(default=None, max_length=120)
    education: Optional[str] = Field(default=None, max_length=200)
    profession: Optional[str] = Field(default=None, max_length=200)
    bio: Optional[str] = Field(default=None, max_length=2000)
    wants_children: Optional[bool] = None
    children_count: Optional[int] = Field(default=None, ge=0, le=20)
    interests: list[str] = Field(default_factory=list, max_length=30)
    lifestyle: list[str] = Field(default_factory=list, max_length=30)
    values: list[str] = Field(default_factory=list, max_length=30)
    preferred_age_min: Optional[int] = Field(default=None, ge=18, le=100)
    preferred_age_max: Optional[int] = Field(default=None, ge=18, le=100)
    preferred_gender: Optional[str] = Field(default=None, max_length=40)
    preferred_location: Optional[str] = Field(default=None, max_length=120)

    @field_validator("date_of_birth")
    @classmethod
    def adult_only(cls, value: date | None):
        if value is not None:
            today = date.today()
            age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
            if age < 18:
                raise ValueError("Mangalamm profiles are for adults 18+")
        return value

    @field_validator("preferred_age_max")
    @classmethod
    def max_age_is_valid(cls, value: int | None, info):
        minimum = info.data.get("preferred_age_min")
        if value is not None and minimum is not None and value < minimum:
            raise ValueError("preferred_age_max must be >= preferred_age_min")
        return value


class ConsentIn(BaseModel):
    consent_type: str = Field(min_length=2, max_length=80)
    granted: bool
    version: str = Field(default="1.0", max_length=40)


class InterestIn(BaseModel):
    profile_id: str


class InterestOut(BaseModel):
    id: str
    status: str
    matched: bool


class MessageIn(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class ProfileOut(BaseModel):
    id: str
    user_id: str
    display_name: str | None
    date_of_birth: date | None
    gender: str | None
    marital_status: str | None
    location: str | None
    education: str | None
    profession: str | None
    bio: str | None
    wants_children: bool | None
    children_count: int | None
    profile_complete_pct: int
