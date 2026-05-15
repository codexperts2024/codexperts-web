import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="codeXperts API")

# Comma-separated list of explicit origins. Production domain and any extra
# Vercel preview aliases should be set here in the Railway environment.
origins = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]

# Allow every Vercel preview deployment for this project without listing each
# preview URL explicitly.
origin_regex = os.getenv(
    "CORS_ORIGIN_REGEX",
    r"https://codexperts-web[\w-]*\.vercel\.app$",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

# Routers added in later sprints:
# from routers import execute, attendance
# app.include_router(execute.router)     # W3: /execute
# app.include_router(attendance.router)  # W4: /attendance/verify
