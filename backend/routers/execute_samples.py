"""POST /execute/samples — run member code against problem sample tests."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from auth import AuthUser, require_member_plus
from services import judge0, rate_limit, samples
from services.supabase_rest import rest_client, service_headers, supabase_url

router = APIRouter(tags=["execute"])


class SampleExecuteRequest(BaseModel):
    problem_id: int = Field(..., gt=0)
    language: str = Field(..., min_length=1)
    code: str = Field(..., min_length=1)


class SampleResult(BaseModel):
    index: int
    passed: bool
    stdin: str
    expected_stdout: str
    stdout: str
    stderr: str
    runtime: float
    exit_code: int


class SampleExecuteResponse(BaseModel):
    results: list[SampleResult]
    passed: int
    total: int


def _fetch_sample_tests(problem_id: int) -> list[dict[str, str]]:
    url = f"{supabase_url()}/rest/v1/problems"
    params = {
        "id": f"eq.{problem_id}",
        "select": "sample_tests",
    }
    with rest_client() as client:
        response = client.get(url, headers=service_headers(), params=params)

    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to load problem samples",
        )

    rows = response.json()
    if not isinstance(rows, list) or not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    return samples.parse_sample_tests(rows[0].get("sample_tests"))


@router.post("/execute/samples", response_model=SampleExecuteResponse)
def execute_samples(
    body: SampleExecuteRequest,
    user: AuthUser = Depends(require_member_plus),
) -> SampleExecuteResponse:
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

    sample_list = _fetch_sample_tests(body.problem_id)
    if not sample_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No sample tests configured for this problem",
        )

    try:
        rate_limit.check_and_increment(user.id, amount=len(sample_list))
    except rate_limit.DailyLimitExceededError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(exc),
        ) from exc

    results: list[SampleResult] = []
    try:
        for index, sample in enumerate(sample_list, start=1):
            run = judge0.execute_code(
                language=body.language,
                code=body.code,
                stdin=sample["stdin"],
            )
            passed = (
                run.exit_code == 0
                and samples.outputs_match(run.stdout, sample["expected_stdout"])
            )
            results.append(
                SampleResult(
                    index=index,
                    passed=passed,
                    stdin=sample["stdin"],
                    expected_stdout=sample["expected_stdout"],
                    stdout=run.stdout,
                    stderr=run.stderr,
                    runtime=run.runtime,
                    exit_code=run.exit_code,
                )
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

    passed_count = sum(1 for row in results if row.passed)
    return SampleExecuteResponse(
        results=results,
        passed=passed_count,
        total=len(results),
    )
