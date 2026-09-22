from pydantic import BaseModel,EmailStr,Field
from typing import Optional,List
class RegisterIn(BaseModel):
    email:EmailStr
    password:str=Field(min_length=8,max_length=128)
    phone:Optional[str]=None
class LoginIn(BaseModel):
    email:EmailStr
    password:str
class TokenOut(BaseModel): access_token:str; refresh_token:str; token_type:str="bearer"
class ProfileIn(BaseModel):
    display_name:str=Field(min_length=2,max_length=120)
    gender:Optional[str]=None; location:Optional[str]=None; education:Optional[str]=None; profession:Optional[str]=None
    bio:Optional[str]=Field(default=None,max_length=2000)
    interests:List[str]=[]; lifestyle:List[str]=[]; values:List[str]=[]
    preferred_age_min:Optional[int]=None; preferred_age_max:Optional[int]=None
class ConsentIn(BaseModel): consent_type:str; granted:bool; version:str="1.0"
