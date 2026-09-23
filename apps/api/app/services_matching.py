from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Any, Protocol


AI_DIMENSIONS = [
    "values",
    "personality",
    "communication",
    "emotional_compatibility",
    "lifestyle",
    "relationship_goals",
    "family_orientation",
    "interests",
    "intellectual_compatibility",
    "life_plans",
]


class MatchingProvider(Protocol):
    name: str
    version: str
    def score(self, seeker: Any, candidate: Any) -> dict[str, Any]: ...


class AstrologyProvider(Protocol):
    name: str
    version: str
    def score(self, seeker: Any, candidate: Any) -> dict[str, Any]: ...


@dataclass
class MatchingWeights:
    ai: int = 60
    astrology: int = 40

    def normalized(self) -> dict[str, int]:
        total = max(1, self.ai + self.astrology)
        return {"ai": round(self.ai / total * 100), "astrology": round(self.astrology / total * 100)}


def _meta(profile: Any) -> dict[str, Any]:
    return profile.ai_metadata or {}


def _list(profile: Any, key: str) -> set[str]:
    return {str(x).strip().lower() for x in (_meta(profile).get(key, []) or []) if str(x).strip()}


def _preferences(profile: Any) -> dict[str, Any]:
    return (_meta(profile).get("preferences", {}) or {})


def _overlap(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 50.0
    return round((2 * len(a & b) / (len(a) + len(b))) * 100, 1)


def _age(dob: date | None) -> int | None:
    if not dob:
        return None
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def _goal_score(a: Any, b: Any) -> float:
    pa, signals = _preferences(a), []
    if pa.get("gender") and getattr(b, "gender", None):
        signals.append(100.0 if pa["gender"] == b.gender else 0.0)
    if pa.get("location") and getattr(b, "location", None):
        signals.append(100.0 if str(pa["location"]).lower() in str(b.location).lower() else 50.0)
    if pa.get("age_min") and getattr(b, "date_of_birth", None):
        signals.append(100.0 if (_age(b.date_of_birth) or 0) >= pa["age_min"] else 0.0)
    if pa.get("age_max") and getattr(b, "date_of_birth", None):
        signals.append(100.0 if (_age(b.date_of_birth) or 0) <= pa["age_max"] else 0.0)
    return round(sum(signals) / len(signals), 1) if signals else 50.0


class FoundationAIMatchingProvider:
    name = "foundation-ai"
    version = "ai-foundation-v1"

    def score(self, seeker: Any, candidate: Any) -> dict[str, Any]:
        dimensions = {
            "values": _overlap(_list(seeker, "values"), _list(candidate, "values")),
            "personality": _overlap(_list(seeker, "personality"), _list(candidate, "personality")),
            "communication": _overlap(_list(seeker, "communication"), _list(candidate, "communication")),
            "emotional_compatibility": _overlap(_list(seeker, "emotional_compatibility"), _list(candidate, "emotional_compatibility")),
            "lifestyle": _overlap(_list(seeker, "lifestyle"), _list(candidate, "lifestyle")),
            "relationship_goals": _goal_score(seeker, candidate),
            "family_orientation": _overlap(_list(seeker, "family_orientation"), _list(candidate, "family_orientation")),
            "interests": _overlap(_list(seeker, "interests"), _list(candidate, "interests")),
            "intellectual_compatibility": _overlap(_list(seeker, "intellectual_compatibility"), _list(candidate, "intellectual_compatibility")),
            "life_plans": _overlap(_list(seeker, "life_plans"), _list(candidate, "life_plans")),
        }
        return {
            "provider": self.name,
            "version": self.version,
            "score": round(sum(dimensions.values()) / len(dimensions), 1),
            "dimensions": dimensions,
            "explanation": "Foundation profile-signal score. A production AI provider can replace this adapter without changing the matching API.",
        }


class FoundationAstrologyProvider:
    name = "astrology-plugin"
    version = "astrology-contract-v1"

    def score(self, seeker: Any, candidate: Any) -> dict[str, Any]:
        a = (_meta(seeker).get("astrology", {}) or {}).get("summary_score")
        b = (_meta(candidate).get("astrology", {}) or {}).get("summary_score")
        if a is None or b is None:
            return {
                "provider": self.name,
                "version": self.version,
                "available": False,
                "score": None,
                "explanation": "Astrology data/provider is not connected yet.",
            }
        return {
            "provider": self.name,
            "version": self.version,
            "available": True,
            "score": round((float(a) + float(b)) / 2, 1),
            "explanation": "Astrology score supplied by the pluggable astrology adapter.",
        }


AI_PROVIDER: MatchingProvider = FoundationAIMatchingProvider()
ASTROLOGY_PROVIDER: AstrologyProvider = FoundationAstrologyProvider()


def calculate_match(seeker: Any, candidate: Any, weights: MatchingWeights | None = None) -> dict[str, Any]:
    weights = weights or MatchingWeights()
    normalized = weights.normalized()
    ai = AI_PROVIDER.score(seeker, candidate)
    astrology = ASTROLOGY_PROVIDER.score(seeker, candidate)

    parts = [(ai["score"], normalized["ai"])]
    if astrology.get("available") and astrology.get("score") is not None:
        parts.append((astrology["score"], normalized["astrology"]))

    denominator = sum(weight for _, weight in parts) or 1
    overall = round(sum(score * weight for score, weight in parts) / denominator, 1)

    return {
        "overall_score": overall,
        "weights": normalized,
        "requested_weights": {"ai": weights.ai, "astrology": weights.astrology},
        "ai": ai,
        "astrology": astrology,
        "disclaimer": "This is a compatibility signal, not a guarantee or certainty about a relationship.",
    }
