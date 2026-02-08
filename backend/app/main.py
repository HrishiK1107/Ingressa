import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.ai import router as ai_router
from app.api.routes.assets import router as assets_router
from app.api.routes.finding_events import router as finding_events_router
from app.api.routes.findings import router as findings_router
from app.api.routes.health import router as health_router
from app.api.routes.reports import router as reports_router
from app.api.routes.scans import router as scans_router
from app.config import settings
from app.core.logging import setup_logging

setup_logging()
log = logging.getLogger("ingressa")

app = FastAPI(
    title="Ingressa API",
    version="0.1.0",
)

# CORS middleware MUST be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add routes after middleware
app.include_router(health_router)
app.include_router(scans_router)
app.include_router(assets_router)
app.include_router(findings_router)
app.include_router(reports_router)
app.include_router(finding_events_router)
app.include_router(ai_router)


@app.on_event("startup")
def startup():
    log.info(
        "startup ok | mode=%s | region=%s | auth=%s",
        settings.SCAN_MODE,
        settings.AWS_REGION_DEFAULT,
        settings.AWS_AUTH_MODE,
    )
