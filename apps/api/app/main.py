from datetime import datetime, timezone
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes_auth import router as auth_router
from .routes_profile import router as profile_router
from .routes_consent import router as consent_router
from .routes_discover import router as discover_router
from .routes_interests import router as interests_router
from .routes_messages import router as messages_router
from .routes_dashboard import router as dashboard_router
from .routes_matching import router as matching_router

app = FastAPI(
    title="Mangalamm API",
    version="0.2.0",
    openapi_url="/api/v1/openapi.json",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(consent_router)
app.include_router(discover_router)
app.include_router(interests_router)
app.include_router(messages_router)
app.include_router(dashboard_router)
app.include_router(matching_router)


def health_payload():
    return {
        "status": "ok",
        "service": "mangalamm-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health")
def health():
    return health_payload()


@app.get("/api/v1/health")
def api_health():
    return health_payload()


@app.get("/api/v1/auth/providers")
def providers():
    return {
        "password": True,
        "phone_otp": True,
        "google": False,
        "facebook": False,
    }
