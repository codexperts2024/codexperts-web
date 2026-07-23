"""Simple per-user daily rate limits for /execute.

In-memory counters reset on process restart. Fine for a single Heroku dyno MVP;
replace with Redis/DB if we scale to multiple dynos.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from threading import Lock

# Member may run code this many times per UTC day.
DAILY_EXECUTE_LIMIT = int(os.getenv("EXECUTE_DAILY_LIMIT", "20"))

_lock = Lock()
# key: (user_id, YYYY-MM-DD) → count
_counts: dict[tuple[str, str], int] = {}


class DailyLimitExceededError(Exception):
    """Raised when the user has no remaining daily execute quota."""


def _today_utc() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def check_and_increment(user_id: str, amount: int = 1) -> int:
    """Increment the user's daily counter by ``amount``.

    Returns remaining quota after this call.
    Raises DailyLimitExceededError when the limit would be exceeded.
    """
    if amount < 1:
        raise ValueError("amount must be >= 1")

    key = (user_id, _today_utc())
    with _lock:
        used = _counts.get(key, 0)
        if used + amount > DAILY_EXECUTE_LIMIT:
            raise DailyLimitExceededError(
                f"Daily execute limit of {DAILY_EXECUTE_LIMIT} reached"
            )
        used += amount
        _counts[key] = used
        return DAILY_EXECUTE_LIMIT - used


def reset_for_tests() -> None:
    """Clear counters (tests only)."""
    with _lock:
        _counts.clear()
