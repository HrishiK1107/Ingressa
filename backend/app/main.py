import logging

from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.config import settings
from app.core.logging import setup_logging

setup_logging()
log = logging.getLogger("ingressa")

app = FastAPI(
    title="Ingressa API",
    version="0.1.0",
)

app.include_router(health_router)


@app.on_event("startup")
def startup():
    log.info(
        "startup ok | mode=%s | region=%s | auth=%s",
        settings.SCAN_MODE,
        settings.AWS_REGION_DEFAULT,
        settings.AWS_AUTH_MODE,
    )
