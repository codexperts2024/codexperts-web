from unittest.mock import MagicMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient

from auth import AuthUser, require_member_plus
from main import app
from services import judge0, rate_limit

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.fixture
def authed_client(monkeypatch):
    monkeypatch.setenv("JUDGE0_RAPIDAPI_KEY", "test-key")
    rate_limit.reset_for_tests()
    app.dependency_overrides[require_member_plus] = lambda: AuthUser(
        id="user-1",
        role="member",
    )
    yield client
    app.dependency_overrides.clear()
    rate_limit.reset_for_tests()


def test_execute_requires_auth():
    response = client.post(
        "/execute",
        json={"language": "python", "code": "print(1)"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Unauthorized"


def test_execute_unsupported_language(authed_client):
    response = authed_client.post(
        "/execute",
        json={"language": "ruby", "code": "puts 1"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Language not supported"


def test_execute_code_too_large(authed_client):
    huge = "x" * (judge0.MAX_CODE_BYTES + 1)
    response = authed_client.post(
        "/execute",
        json={"language": "python", "code": huge},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Code size limit exceeded"


def test_execute_success(authed_client):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "stdout": "Hello, World!\n",
        "stderr": "",
        "compile_output": "",
        "time": "0.023",
        "status": {"id": 3, "description": "Accepted"},
    }

    with patch("services.judge0.httpx.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.__exit__.return_value = False
        mock_client.post.return_value = mock_response
        mock_client_cls.return_value = mock_client

        response = authed_client.post(
            "/execute",
            json={"language": "python", "code": "print('Hello, World!')"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["stdout"] == "Hello, World!\n"
    assert body["stderr"] == ""
    assert body["exit_code"] == 0
    assert body["runtime"] == 0.023


def test_execute_runtime_error_returns_200(authed_client):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "stdout": "",
        "stderr": "NameError: name 'x' is not defined",
        "compile_output": "",
        "time": "0.011",
        "status": {"id": 11, "description": "Runtime Error (NZEC)"},
    }

    with patch("services.judge0.httpx.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.__exit__.return_value = False
        mock_client.post.return_value = mock_response
        mock_client_cls.return_value = mock_client

        response = authed_client.post(
            "/execute",
            json={"language": "python", "code": "print(x)"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["exit_code"] == 1
    assert "NameError" in body["stderr"]


def test_execute_compile_error_returns_200(authed_client):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "stdout": None,
        "stderr": None,
        "compile_output": "error: expected ';'",
        "time": None,
        "status": {"id": 6, "description": "Compilation Error"},
    }

    with patch("services.judge0.httpx.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.__exit__.return_value = False
        mock_client.post.return_value = mock_response
        mock_client_cls.return_value = mock_client

        response = authed_client.post(
            "/execute",
            json={"language": "cpp", "code": "int main() {"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["exit_code"] == 1
    assert "expected" in body["stderr"]


def test_execute_timeout(authed_client):
    with patch("services.judge0.httpx.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.__exit__.return_value = False
        mock_client.post.side_effect = httpx.TimeoutException("timed out")
        mock_client_cls.return_value = mock_client

        response = authed_client.post(
            "/execute",
            json={"language": "python", "code": "while True: pass"},
        )

    assert response.status_code == 408
    assert response.json()["detail"] == "Execution timed out"


def test_execute_judge0_unavailable(authed_client):
    with patch("services.judge0.httpx.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.__exit__.return_value = False
        mock_client.post.side_effect = httpx.ConnectError("refused")
        mock_client_cls.return_value = mock_client

        response = authed_client.post(
            "/execute",
            json={"language": "python", "code": "print(1)"},
        )

    assert response.status_code == 503
    assert response.json()["detail"] == "Code execution service unavailable"


def test_judge0_maps_python_language_id(monkeypatch):
    monkeypatch.setenv("JUDGE0_RAPIDAPI_KEY", "test-key")
    captured = {}

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "stdout": "ok\n",
        "stderr": "",
        "compile_output": "",
        "time": "0.01",
        "status": {"id": 3, "description": "Accepted"},
    }

    with patch("services.judge0.httpx.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.__exit__.return_value = False

        def capture_post(url, params=None, headers=None, json=None):
            captured["url"] = url
            captured["params"] = params
            captured["headers"] = headers
            captured["json"] = json
            return mock_response

        mock_client.post.side_effect = capture_post
        mock_client_cls.return_value = mock_client

        result = judge0.execute_code("python", "print('ok')")

    assert result.exit_code == 0
    assert captured["json"]["language_id"] == 100
    assert captured["params"]["wait"] == "true"
    assert captured["headers"]["X-RapidAPI-Key"] == "test-key"


def test_execute_daily_limit(authed_client, monkeypatch):
    monkeypatch.setattr(rate_limit, "DAILY_EXECUTE_LIMIT", 2)

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "stdout": "1\n",
        "stderr": "",
        "compile_output": "",
        "time": "0.01",
        "status": {"id": 3, "description": "Accepted"},
    }

    with patch("services.judge0.httpx.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.__enter__.return_value = mock_client
        mock_client.__exit__.return_value = False
        mock_client.post.return_value = mock_response
        mock_client_cls.return_value = mock_client

        assert (
            authed_client.post(
                "/execute",
                json={"language": "python", "code": "print(1)"},
            ).status_code
            == 200
        )
        assert (
            authed_client.post(
                "/execute",
                json={"language": "python", "code": "print(1)"},
            ).status_code
            == 200
        )
        limited = authed_client.post(
            "/execute",
            json={"language": "python", "code": "print(1)"},
        )

    assert limited.status_code == 429
    assert "Daily execute limit" in limited.json()["detail"]
