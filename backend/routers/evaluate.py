"""POST /evaluate — soft forbidden hints + Gemini Big O / duplication."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from auth import AuthUser, require_member_plus
from services import forbidden, gemini_evaluate, judge0, rate_limit

router = APIRouter(tags=["evaluate"])


class EvaluateRequest(BaseModel):
    problem_id: int = Field(..., gt=0)
    language: str = Field(..., min_length=1)
    code: str = Field(..., min_length=1)
    samples_passed: bool = False


class ForbiddenHint(BaseModel):
    rule: str
    hint: str
    line: int | None = None


class EvaluateResponse(BaseModel):
    forbidden_hints: list[ForbiddenHint]
    big_o: str
    big_o_reason: str
    duplicates: list[str]


@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(
    body: EvaluateRequest,
    user: AuthUser = Depends(require_member_plus),
) -> EvaluateResponse:
    if body.language not in judge0.SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language not supported",
        )
    try:
        judge0.validate_code_size(body.code)
    except judge0.CodeTooLargeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code size limit exceeded",
        )

    if not body.samples_passed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All sample tests must pass before Evaluate",
        )

    try:
        rate_limit.check_and_increment(user.id, kind="evaluate")
    except rate_limit.DailyLimitExceededError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(exc),
        ) from exc

    hits = forbidden.check_forbidden(body.code, body.language)
    forbidden_hints = [
        ForbiddenHint(rule=hit.rule, hint=hit.hint, line=hit.line) for hit in hits
    ]

    try:
        result = gemini_evaluate.evaluate_code(body.language, body.code)
    except gemini_evaluate.GeminiUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return EvaluateResponse(
        forbidden_hints=forbidden_hints,
        big_o=result.big_o,
        big_o_reason=result.big_o_reason,
        duplicates=result.duplicates,
    )
