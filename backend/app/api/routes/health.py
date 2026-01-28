import logging

from fastapi import APIRouter

from app.schemas.common import HealthOut

router = APIRouter(tags=["health"])
log = logging.getLogger("ingressa.health")


@router.get("/health", response_model=HealthOut)
def health():
    log.info("health check ok")
    return {"status": "ok"}
