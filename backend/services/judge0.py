"""Judge0 CE client via RapidAPI for sandboxed code execution."""

from __future__ import annotations

import os
import time
from dataclasses import dataclass

import httpx

JUDGE0_BASE_URL = os.getenv(
    "JUDGE0_BASE_URL",
    "https://judge0-ce.p.rapidapi.com",
).rstrip("/")
JUDGE0_RAPIDAPI_HOST = os.getenv(
    "JUDGE0_RAPIDAPI_HOST",
    "judge0-ce.p.rapidapi.com",
)

MAX_CODE_BYTES = 50 * 1024
EXECUTION_TIMEOUT_SECONDS = 10.0

# Frontend language keys → Judge0 CE language_id
# IDs from https://ce.judge0.com/languages
SUPPORTED_LANGUAGES: dict[str, int] = {
    "python": 100,  # Python 3.12.5
    "java": 91,  # Java (JDK 17.0.6)
    "cpp": 105,  # C++ (GCC 14.1.0)
    "javascript": 93,  # JavaScript (Node.js 18.15.0)
}

# Judge0 status.id reference: 3 = Accepted
STATUS_ACCEPTED = 3
STATUS_TIME_LIMIT = 5


class ExecutionError(Exception):
    """Base error for code execution failures."""


class UnsupportedLanguageError(ExecutionError):
    """Raised when the requested language is not supported."""


class CodeTooLargeError(ExecutionError):
    """Raised when submitted code exceeds MAX_CODE_BYTES."""


class ExecutionUnavailableError(ExecutionError):
    """Raised when Judge0 cannot be reached or is misconfigured."""


class ExecutionTimeoutError(ExecutionError):
    """Raised when execution exceeds EXECUTION_TIMEOUT_SECONDS."""


@dataclass(frozen=True)
class ExecutionResult:
    stdout: str
    stderr: str
    runtime: float
    exit_code: int


def validate_code_size(code: str) -> None:
    if len(code.encode("utf-8")) > MAX_CODE_BYTES:
        raise CodeTooLargeError("Code size limit exceeded")


def _rapidapi_key() -> str:
    key = (os.getenv("JUDGE0_RAPIDAPI_KEY") or "").strip()
    if not key:
        raise ExecutionUnavailableError("Code execution service unavailable")
    return key


def execute_code(language: str, code: str, stdin: str = "") -> ExecutionResult:
    """Submit code to Judge0 (wait=true) and map the response."""
    language_id = SUPPORTED_LANGUAGES.get(language)
    if language_id is None:
        raise UnsupportedLanguageError("Language not supported")

    validate_code_size(code)
    api_key = _rapidapi_key()

    payload = {
        "language_id": language_id,
        "source_code": code,
        "stdin": stdin or "",
    }
    params = {
        "base64_encoded": "false",
        "wait": "true",
        "fields": "*",
    }
    headers = {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": JUDGE0_RAPIDAPI_HOST,
    }

    url = f"{JUDGE0_BASE_URL}/submissions"
    started = time.perf_counter()

    try:
        with httpx.Client(timeout=EXECUTION_TIMEOUT_SECONDS) as client:
            response = client.post(url, params=params, headers=headers, json=payload)
    except httpx.TimeoutException as exc:
        raise ExecutionTimeoutError("Execution timed out") from exc
    except httpx.HTTPError as exc:
        raise ExecutionUnavailableError("Code execution service unavailable") from exc

    elapsed = time.perf_counter() - started

    if response.status_code == 429:
        raise ExecutionUnavailableError("Code execution service unavailable")

    if response.status_code >= 500:
        raise ExecutionUnavailableError("Code execution service unavailable")

    if response.status_code >= 400:
        raise ExecutionUnavailableError("Code execution service unavailable")

    try:
        data = response.json()
    except ValueError as exc:
        raise ExecutionUnavailableError("Code execution service unavailable") from exc

    status = data.get("status") or {}
    status_id = status.get("id")
    if status_id == STATUS_TIME_LIMIT:
        raise ExecutionTimeoutError("Execution timed out")

    stdout = data.get("stdout") or ""
    stderr_parts = [
        part
        for part in (
            data.get("compile_output") or "",
            data.get("stderr") or "",
            status.get("description") if status_id not in (None, STATUS_ACCEPTED) else "",
        )
        if part
    ]
    # Avoid duplicating Accepted noise; keep judge messages for failures only.
    stderr = "\n".join(stderr_parts).strip()

    time_value = data.get("time")
    try:
        runtime = float(time_value) if time_value is not None else round(elapsed, 3)
    except (TypeError, ValueError):
        runtime = round(elapsed, 3)

    exit_code = 0 if status_id == STATUS_ACCEPTED else 1

    return ExecutionResult(
        stdout=stdout,
        stderr=stderr,
        runtime=round(runtime, 3),
        exit_code=exit_code,
    )
