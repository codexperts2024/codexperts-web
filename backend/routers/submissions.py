"""POST /submissions — upsert a member solution for a problem."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from auth import AuthUser, require_member_plus
from services import submissions

router = APIRouter(tags=["submissions"])


class SubmissionRequest(BaseModel):
    problem_id: int = Field(..., gt=0)
    language: str = Field(..., min_length=1)
    code: str = Field(..., min_length=1)


class SubmissionResponse(BaseModel):
    message: str
    submission_id: int
    submitted_at: str


@router.post("/submissions", response_model=SubmissionResponse)
def create_submission(
    body: SubmissionRequest,
    user: AuthUser = Depends(require_member_plus),
) -> SubmissionResponse:
    try:
        result = submissions.upsert_submission(
            profile_id=user.id,
            problem_id=body.problem_id,
            language=body.language,
            code=body.code,
        )
    except submissions.UnsupportedLanguageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language not supported",
        )
    except submissions.CodeTooLargeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code size limit exceeded",
        )
    except submissions.ProblemNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )
    except submissions.SubmissionUnavailableError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Submission service unavailable",
        )

    return SubmissionResponse(
        message="Solution submitted!",
        submission_id=result.submission_id,
        submitted_at=result.submitted_at,
    )
