"""Gemini Flash-Lite client for Solutions Evaluate."""

from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass

import httpx

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
GEMINI_TIMEOUT_SECONDS = float(os.getenv("GEMINI_TIMEOUT_SECONDS", "45"))

SYSTEM_INSTRUCTION = """You are a programming coach for a competitive programming club.
Analyze the student's code ONLY for:
1) asymptotic time complexity (Big O)
2) duplicated or near-duplicated logic

Rules:
- Do NOT provide the correct solution, algorithms to use, or step-by-step fixes.
- Do NOT rewrite the student's code.
- Do NOT mention test cases, expected output, or problem answers.
- If unsure about Big O, pick the best estimate and say so briefly in big_o_reason.
- Respond with JSON only matching the schema. No markdown.
"""


class GeminiUnavailableError(Exception):
    """Raised when Gemini is not configured or the API call fails."""


@dataclass(frozen=True)
class GeminiEvaluation:
    big_o: str
    big_o_reason: str
    duplicates: list[str]


def _api_key() -> str:
    key = (os.getenv("GEMINI_API_KEY") or "").strip()
    if not key or key == "your-gemini-api-key":
        raise GeminiUnavailableError("Evaluate service is not configured")
    return key


def _extract_json(text: str) -> dict:
    raw = (text or "").strip()
    if not raw:
        raise GeminiUnavailableError("Evaluate service unavailable")
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{.*\}", raw, flags=re.DOTALL)
    if not match:
        raise GeminiUnavailableError("Evaluate service unavailable")
    data = json.loads(match.group(0))
    if not isinstance(data, dict):
        raise GeminiUnavailableError("Evaluate service unavailable")
    return data


def evaluate_code(language: str, code: str) -> GeminiEvaluation:
    """Call Gemini and return Big O + duplication notes."""
    api_key = _api_key()
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent"
    )
    payload = {
        "systemInstruction": {
            "parts": [{"text": SYSTEM_INSTRUCTION}],
        },
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            f"Language: {language}\n\nCode:\n```\n{code}\n```\n\n"
                            "Return JSON with keys big_o (string), big_o_reason "
                            "(one short sentence), duplicates (array of short notes; "
                            "empty if none)."
                        ),
                    }
                ],
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "object",
                "properties": {
                    "big_o": {"type": "string"},
                    "big_o_reason": {"type": "string"},
                    "duplicates": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                },
                "required": ["big_o", "big_o_reason", "duplicates"],
            },
        },
    }

    try:
        with httpx.Client(timeout=GEMINI_TIMEOUT_SECONDS) as client:
            response = client.post(url, params={"key": api_key}, json=payload)
    except httpx.TimeoutException as exc:
        raise GeminiUnavailableError("Evaluate timed out") from exc
    except httpx.HTTPError as exc:
        raise GeminiUnavailableError("Evaluate service unavailable") from exc

    if response.status_code == 429:
        raise GeminiUnavailableError("Evaluate rate limited by provider")
    if response.status_code >= 400:
        raise GeminiUnavailableError("Evaluate service unavailable")

    try:
        body = response.json()
        text = body["candidates"][0]["content"]["parts"][0]["text"]
        data = _extract_json(text)
    except (KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError) as exc:
        raise GeminiUnavailableError("Evaluate service unavailable") from exc

    duplicates_raw = data.get("duplicates") or []
    if not isinstance(duplicates_raw, list):
        duplicates_raw = []
    duplicates = [str(item).strip() for item in duplicates_raw if str(item).strip()]

    return GeminiEvaluation(
        big_o=str(data.get("big_o") or "Unknown").strip() or "Unknown",
        big_o_reason=str(data.get("big_o_reason") or "").strip(),
        duplicates=duplicates,
    )
