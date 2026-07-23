"""POST /execute — proxy member code to Judge0 (RapidAPI)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from auth import AuthUser, require_member_plus
from services import judge0, rate_limit

router = APIRouter(tags=["execute"])


class ExecuteRequest(BaseModel):
    language: str = Field(..., min_length=1)
    code: str = Field(..., min_length=1)
    stdin: str = ""


class ExecuteResponse(BaseModel):
    stdout: str
    stderr: str
    runtime: float
    exit_code: int


@router.post("/execute", response_model=ExecuteResponse)
def execute(
    body: ExecuteRequest,
    user: AuthUser = Depends(require_member_plus),
) -> ExecuteResponse:
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

    try:
        rate_limit.check_and_increment(user.id)
    except rate_limit.DailyLimitExceededError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(exc),
        ) from exc

    try:
        result = judge0.execute_code(
            language=body.language,
            code=body.code,
            stdin=body.stdin,
        )
    except judge0.UnsupportedLanguageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language not supported",
        )
    except judge0.CodeTooLargeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code size limit exceeded",
        )
    except judge0.ExecutionTimeoutError:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Execution timed out",
        )
    except judge0.ExecutionUnavailableError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Code execution service unavailable",
        )

    return ExecuteResponse(
        stdout=result.stdout,
        stderr=result.stderr,
        runtime=result.runtime,
        exit_code=result.exit_code,
    )
