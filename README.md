# Mangalamm.lk

A privacy-first matrimonial platform for Sri Lanka, designed as a normal matrimonial product first and prepared for future AI-assisted compatibility.

## Current foundation

- Next.js + TypeScript responsive PWA
- FastAPI + Pydantic backend
- PostgreSQL + Alembic
- Redis-ready infrastructure
- Argon2 password hashing
- JWT access tokens with rotating, revocable refresh sessions
- Structured matrimonial profile data and completeness tracking
- Consent history for AI/research/astrology permissions
- Discovery filters for location, gender and age
- Interest flow with automatic mutual-match creation
- Matched-user messaging API and responsive UI
- Audit events for authentication/profile/matching access
- Versioned compatibility field on matches

## Privacy boundary

Cellie or any future AI system must not receive unrestricted access to private user memory.

The intended boundary is:

`Personal AI Memory → Consent Gateway → Authorized Matching Profile → Mangalamm Matching`

Stored information is not automatically shareable information. Sensitive observations must remain protected and require explicit authorization before entering the matching layer.

## Local development

### Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` when the API is not served from the same origin.

### Database

Use PostgreSQL. The repository includes Alembic migrations up to `0003_matching_core`.

```bash
alembic upgrade head
```

## Environment

Copy `.env.example` to your environment and provide real secrets for production.

Required production secrets include:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

Provider credentials are intentionally environment-driven and are not committed to Git.

## Product roadmap

1. Production identity verification provider
2. Email/phone/WhatsApp verification and OTP
3. Google/Facebook OAuth
4. Profile photos and secure object storage
5. Blocking, reporting and moderation
6. AI provider adapters and authorized Cellie integration
7. Compatibility engine + explainable match reasons
8. Separate astrology engine
9. Admin/researcher operations and analytics
10. Production observability, rate limiting and deployment hardening
