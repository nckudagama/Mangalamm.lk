from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from .routes_auth import router as auth_router
from .routes_profile import router as profile_router
from .routes_consent import router as consent_router
from .routes_discover import router as discover_router
app=FastAPI(title="Mangalamm API",version="0.2.0",openapi_url="/api/v1/openapi.json")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:3000"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.include_router(auth_router); app.include_router(profile_router); app.include_router(consent_router); app.include_router(discover_router)
@app.get("/api/v1/health")
def health(): return {"status":"ok","service":"mangalamm-api","timestamp":datetime.now(timezone.utc).isoformat()}
@app.get("/api/v1/auth/providers")
def providers(): return {"password":True,"phone_otp":True,"google":False,"facebook":False}
