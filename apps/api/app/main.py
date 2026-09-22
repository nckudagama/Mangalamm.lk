from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
app=FastAPI(title="Mangalamm API",version="0.1.0",openapi_url="/api/v1/openapi.json")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:3000"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
@app.get("/api/v1/health")
def health(): return {"status":"ok","service":"mangalamm-api","timestamp":datetime.now(timezone.utc).isoformat()}
@app.get("/api/v1/auth/providers")
def providers(): return {"password":True,"phone_otp":True,"google":False,"facebook":False}
