"""Compare Judge0 stdout to expected sample output."""

from __future__ import annotations


def normalize_stdout(text: str | None) -> str:
    """Trim trailing whitespace per line and strip trailing blank lines."""
    normalized = (text or "").replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.rstrip() for line in normalized.split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines)


def outputs_match(actual: str | None, expected: str | None) -> bool:
    return normalize_stdout(actual) == normalize_stdout(expected)


def parse_sample_tests(raw) -> list[dict[str, str]]:
    """Return up to 10 usable sample pairs from a problems.sample_tests value."""
    if not isinstance(raw, list):
        return []

    samples: list[dict[str, str]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        stdin = item.get("stdin")
        expected = item.get("expected_stdout")
        if stdin is None and expected is None:
            continue
        stdin_s = "" if stdin is None else str(stdin)
        expected_s = "" if expected is None else str(expected)
        if stdin_s.strip() == "" and expected_s.strip() == "":
            continue
        samples.append({"stdin": stdin_s, "expected_stdout": expected_s})
        if len(samples) >= 10:
            break
    return samples
