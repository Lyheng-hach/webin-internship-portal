from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models  # registers all SQLAlchemy models with Base.metadata before any FK is resolved
from routers import auth, students, supervisors, companies, admin, positions, applications, interviews, evaluations, notifications, universities, interns, documents, skills
from routers.supervision_requests import request_router as supervision_req_router, notif_router as sup_notif_router

app = FastAPI(
    title="Job Portal API",
    description="Internship Job Portal — Backend API",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://webin-internship-portal.vercel.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,          prefix="/api/auth",          tags=["Auth"])
app.include_router(students.router,      prefix="/api/students",      tags=["Students"])
app.include_router(supervisors.router,   prefix="/api/supervisors",   tags=["Supervisors"])
app.include_router(companies.router,     prefix="/api/companies",     tags=["Companies"])
app.include_router(admin.router,         prefix="/api/admin",         tags=["Admin"])
app.include_router(positions.router,     prefix="/api/positions",     tags=["Intern Positions"])
app.include_router(applications.router,  prefix="/api/applications",  tags=["Applications"])
app.include_router(interviews.router,    prefix="/api/interviews",    tags=["Interviews"])
app.include_router(evaluations.router,   prefix="/api/evaluations",   tags=["Evaluations"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(universities.router,  prefix="/api/universities",  tags=["Universities"])
app.include_router(interns.router,           prefix="/api/interns",               tags=["Interns"])
app.include_router(documents.router,         prefix="/api/documents",             tags=["Documents"])
app.include_router(skills.router,            prefix="/api/skills",                tags=["Skills"])
app.include_router(supervision_req_router,   prefix="/api/supervision-requests",  tags=["Supervision Requests"])
app.include_router(sup_notif_router,         prefix="/api/supervisor-notifications", tags=["Supervisor Notifications"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Job Portal API is running"}
