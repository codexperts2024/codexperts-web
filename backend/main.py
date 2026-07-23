import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="codeXperts API")

# Comma-separated list of explicit origins. Production domain and Vercel preview
# aliases should be set in the Heroku config vars.
origins = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]

# Allow every Vercel preview deployment for this project without listing each
# preview URL explicitly.
origin_regex = (
    os.getenv("CORS_ORIGIN_REGEX", r"https://codexperts-web[\w-]*\.vercel\.app$").strip()
    or None
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

from routers import documents, evaluate, execute, execute_samples, submissions

app.include_router(documents.router)
app.include_router(execute.router)
app.include_router(execute_samples.router)
app.include_router(evaluate.router)
app.include_router(submissions.router)

# Routers added in later sprints:
# from routers import attendance
# app.include_router(attendance.router)  # W4: /attendance/verify
