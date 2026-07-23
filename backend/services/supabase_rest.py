"""Supabase REST helpers for FastAPI services."""

from __future__ import annotations

import os

import httpx
from fastapi import HTTPException, status


def supabase_url() -> str:
    url = (os.getenv("SUPABASE_URL") or "").rstrip("/")
    if not url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service is not configured",
        )
    return url


def service_role_key() -> str:
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or ""
    if not key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service is not configured",
        )
    return key


def service_headers(*, prefer: str | None = None) -> dict[str, str]:
    key = service_role_key()
    headers = {
        "Authorization": f"Bearer {key}",
        "apikey": key,
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    if prefer:
        headers["Prefer"] = prefer
    return headers


def rest_client(timeout: float = 10.0) -> httpx.Client:
    return httpx.Client(timeout=timeout)
