import os
from datetime import datetime,timedelta,timezone
import jwt
from pwdlib import PasswordHash
password_hash=PasswordHash.recommended()
JWT_SECRET=os.getenv("JWT_SECRET","change-me")
JWT_REFRESH_SECRET=os.getenv("JWT_REFRESH_SECRET","change-me")
def hash_password(password:str)->str: return password_hash.hash(password)
def verify_password(password:str,hashed:str)->bool: return password_hash.verify(password,hashed)
def create_access_token(sub:str)->str:
    return jwt.encode({"sub":sub,"type":"access","exp":datetime.now(timezone.utc)+timedelta(minutes=30)},JWT_SECRET,algorithm="HS256")
def create_refresh_token(sub:str)->str:
    return jwt.encode({"sub":sub,"type":"refresh","exp":datetime.now(timezone.utc)+timedelta(days=30)},JWT_REFRESH_SECRET,algorithm="HS256")
def decode_access_token(token:str): return jwt.decode(token,JWT_SECRET,algorithms=["HS256"])
