# AI Brain Integration Contract

The first release does not require an AI brain to operate.

## Phase 1
Deterministic matrimonial search and matching use explicit profile fields, hard filters, preferences and configurable weights.

## Future Cellie integration
Conversation -> candidate observations -> fact/inference classification -> user confirmation and consent -> structured matrimonial profile -> Authorized Matching Profile -> compatibility engine -> AI reasoning -> explainable suggestions.

## Provider abstraction
Application code depends on an AIProvider interface, not directly on a vendor SDK.

Planned adapters:
- OpenAI
- Anthropic Claude
- Google Gemini

## Safety
AI observations are not automatically facts. Sensitive behavioral/psychological signals remain protected and are never automatically shown to another member.
