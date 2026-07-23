"""Soft forbidden-pattern checks for Evaluate (do not affect Sample Pass/Fail)."""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class ForbiddenHit:
    rule: str
    hint: str
    line: int | None


# Preset A: contest-style coaching, not correctness.
_RULES: dict[str, list[tuple[str, str, str]]] = {
    # language -> list of (rule_id, regex, hint)
    "*": [
        (
            "break",
            r"\bbreak\b",
            "Not a failure. Some courses and contests discourage break; try structured loops instead.",
        ),
    ],
    "python": [
        (
            "builtin-sort",
            r"\bsorted\s*\(|\.sort\s*\(",
            "Not a failure. Contests often ban built-in sort so you practice implementing it yourself.",
        ),
    ],
    "java": [
        (
            "builtin-sort",
            r"\bArrays\s*\.\s*sort\s*\(|\bCollections\s*\.\s*sort\s*\(",
            "Not a failure. Contests often ban built-in sort so you practice implementing it yourself.",
        ),
    ],
    "c": [
        (
            "builtin-sort",
            r"\bqsort\s*\(",
            "Not a failure. Contests often ban library sort so you practice implementing it yourself.",
        ),
    ],
    "cpp": [
        (
            "builtin-sort",
            r"\bstd\s*::\s*sort\s*\(|\bsort\s*\(",
            "Not a failure. Contests often ban std::sort so you practice implementing it yourself.",
        ),
        (
            "stl-map",
            r"\b(?:std\s*::\s*)?map\s*<",
            "Not a failure. Some assignments disallow std::map; try arrays or your own structure.",
        ),
        (
            "stl-set",
            r"\b(?:std\s*::\s*)?set\s*<",
            "Not a failure. Some assignments disallow std::set; try another approach.",
        ),
        (
            "stl-priority-queue",
            r"\b(?:std\s*::\s*)?priority_queue\s*<",
            "Not a failure. Some assignments disallow priority_queue; try implementing a heap yourself.",
        ),
    ],
    "javascript": [
        (
            "builtin-sort",
            r"\.sort\s*\(",
            "Not a failure. Contests often ban built-in sort so you practice implementing it yourself.",
        ),
    ],
    "typescript": [
        (
            "builtin-sort",
            r"\.sort\s*\(",
            "Not a failure. Contests often ban built-in sort so you practice implementing it yourself.",
        ),
    ],
}


def _line_number(code: str, index: int) -> int:
    return code.count("\n", 0, index) + 1


def check_forbidden(code: str, language: str) -> list[ForbiddenHit]:
    hits: list[ForbiddenHit] = []
    seen: set[str] = set()
    rules = list(_RULES.get("*", [])) + list(_RULES.get(language, []))
    for rule_id, pattern, hint in rules:
        if rule_id in seen:
            continue
        match = re.search(pattern, code)
        if not match:
            continue
        seen.add(rule_id)
        hits.append(
            ForbiddenHit(
                rule=rule_id,
                hint=hint,
                line=_line_number(code, match.start()),
            )
        )
    return hits
