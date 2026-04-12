from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="codeXperts API")

origins = [
    "http://localhost:3000",
    "https://codexperts-web-production.up.railway.app",
    "https://codexperts-web-psi.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
