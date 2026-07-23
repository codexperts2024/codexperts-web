"""Persist member code submissions to Supabase."""

from __future__ import annotations

from dataclasses import dataclass

import httpx

from services import judge0
from services.supabase_rest import rest_client, service_headers, supabase_url

SUPPORTED_LANGUAGES = frozenset(judge0.SUPPORTED_LANGUAGES.keys())
MAX_CODE_BYTES = judge0.MAX_CODE_BYTES


class SubmissionError(Exception):
    """Base error for submission persistence."""


class UnsupportedLanguageError(SubmissionError):
    pass


class CodeTooLargeError(SubmissionError):
    pass


class ProblemNotFoundError(SubmissionError):
    pass


class SubmissionUnavailableError(SubmissionError):
    pass


@dataclass(frozen=True)
class SubmissionResult:
    submission_id: int
    submitted_at: str


def validate_language(language: str) -> None:
    if language not in SUPPORTED_LANGUAGES:
        raise UnsupportedLanguageError("Language not supported")


def validate_code_size(code: str) -> None:
    if len(code.encode("utf-8")) > MAX_CODE_BYTES:
        raise CodeTooLargeError("Code size limit exceeded")


def problem_exists(problem_id: int) -> bool:
    url = f"{supabase_url()}/rest/v1/problems"
    try:
        with rest_client() as client:
            response = client.get(
                url,
                params={"id": f"eq.{problem_id}", "select": "id"},
                headers=service_headers(),
            )
    except httpx.HTTPError as exc:
        raise SubmissionUnavailableError("Submission service unavailable") from exc

    if response.status_code != 200:
        raise SubmissionUnavailableError("Submission service unavailable")

    try:
        rows = response.json()
    except ValueError as exc:
        raise SubmissionUnavailableError("Submission service unavailable") from exc

    return isinstance(rows, list) and len(rows) > 0


def upsert_submission(
    *,
    profile_id: str,
    problem_id: int,
    language: str,
    code: str,
) -> SubmissionResult:
    validate_language(language)
    validate_code_size(code)

    if not problem_exists(problem_id):
        raise ProblemNotFoundError("Problem not found")

    url = f"{supabase_url()}/rest/v1/submissions"
    payload = {
        "profile_id": profile_id,
        "problem_id": problem_id,
        "language": language,
        "code": code,
    }
    headers = service_headers(
        prefer="resolution=merge-duplicates,return=representation",
    )
    # PostgREST upsert on unique (profile_id, problem_id)
    params = {"on_conflict": "profile_id,problem_id"}

    try:
        with rest_client() as client:
            response = client.post(url, params=params, headers=headers, json=payload)
    except httpx.HTTPError as exc:
        raise SubmissionUnavailableError("Submission service unavailable") from exc

    if response.status_code not in (200, 201):
        raise SubmissionUnavailableError("Submission service unavailable")

    try:
        rows = response.json()
    except ValueError as exc:
        raise SubmissionUnavailableError("Submission service unavailable") from exc

    if not isinstance(rows, list) or not rows:
        raise SubmissionUnavailableError("Submission service unavailable")

    row = rows[0]
    submission_id = row.get("id")
    submitted_at = row.get("updated_at") or row.get("created_at")
    if submission_id is None or not submitted_at:
        raise SubmissionUnavailableError("Submission service unavailable")

    return SubmissionResult(
        submission_id=int(submission_id),
        submitted_at=str(submitted_at),
    )
