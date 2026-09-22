# Mangalamm Architecture

## Core layers
1. Web/PWA experience
2. API and application services
3. PostgreSQL persistence
4. Redis/background processing
5. Verification/storage integrations
6. AI provider abstraction

## Privacy boundary

Personal Cellie Memory -> Consent Gateway -> Authorized Matching Profile -> Matching/Discovery services.

The matching platform must not have unrestricted access to personal AI memory.

## Modular domains
- auth
- users
- profiles
- preferences
- verification
- consent/privacy
- discovery/matching
- conversations
- notifications
- moderation/admin
- AI

## Versioning
Future compatibility, profile schema, AI prompt, and astrology engines must be versioned rather than hard-coded.

## Deployment shape
Start as a modular monolith. Keep interfaces clean so individual domains can be extracted later if scale requires it.
