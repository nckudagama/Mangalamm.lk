# Mangalamm Backend Readiness

## Product priorities

Mangalamm is a privacy-first matrimonial product, so the backend must remain the source of truth for identity, profile visibility, discovery, matching, communication, verification, moderation, billing and auditability.

## Required backend domains

1. Authentication & account security
   - registration, login, refresh rotation, logout-all, password reset
   - OTP/email/phone verification
   - rate limits, brute-force protection, device/session management
   - future passkey support

2. Profile & privacy
   - profile sections and completion state
   - visibility policies enforced server-side
   - private contact fields separated from public profile data
   - photo/media access through signed/private URLs
   - consent records and privacy settings

3. Discovery & matching
   - server-side filters
   - candidate eligibility and blocking
   - pluggable Mangalamm Brain provider
   - deterministic foundation score + future AI provider
   - explanation/factors/confidence
   - matching configuration/versioning so scores are reproducible

4. Interests & relationships
   - sent/accepted/declined/withdrawn/blocked states
   - shortlist
   - unmatch/block/mute
   - conversation eligibility enforced by API

5. Messaging
   - conversations, messages, read state
   - abuse/spam controls
   - moderation hooks
   - notification events

6. Verification & trust
   - email, phone, photo and identity verification
   - review queue and evidence handling
   - verification state separate from profile data
   - audit trail for every admin decision

7. Safety & moderation
   - report/block flows
   - report reasons and evidence
   - moderation queue
   - account restrictions/suspension
   - admin notes kept private
   - abuse/risk signals

8. Membership & payments
   - plans, entitlements, subscriptions
   - payment provider webhooks
   - idempotency
   - invoices/refunds
   - entitlement checks on the backend

9. Notifications
   - in-app, push, email and SMS abstraction
   - preferences
   - delivery/retry status
   - event-driven jobs

10. Admin & operations
   - RBAC
   - dashboard KPIs
   - member/verification/report queues
   - CMS/settings
   - immutable audit events
   - support tooling without exposing unnecessary private data

11. Data & analytics
   - event model
   - consent-aware analytics
   - funnel metrics
   - matching quality metrics
   - abuse/safety metrics
   - deletion/export workflows

## Mangalamm Brain boundary

Keep language understanding separate from matching logic:

User language (Sinhala/English/etc.)
-> profile understanding
-> structured compatibility signals
-> matching engine
-> explanation

The first production language set is Sinhala + English. Malayalam, Tamil and Hindi can be added later without rewriting the matching engine.

## Security baseline

Use OWASP ASVS as the application-security checklist, with particular attention to session management, access control, validation, data protection, business logic, file handling and API security.

Identity proofing/authentication should be designed against current NIST SP 800-63-4 guidance where applicable.

## Immediate implementation order

P0: auth hardening, privacy/authorization, profile/media model, verification model, reports/blocks, audit logs, rate limiting.

P1: messaging, notifications, memberships/payments, admin operations, background jobs.

P2: production Mangalamm Brain provider, explainability, experimentation, analytics and quality feedback loops.

P3: regional language expansion and India-specific operational/payment requirements.

## Non-negotiables

- Never trust frontend authorization.
- Never expose phone/email/private documents in discovery.
- Never make matching decisions only in the browser.
- Never store raw payment credentials.
- Never let admin access bypass audit logging.
- Never treat AI output as a guaranteed marriage outcome.
