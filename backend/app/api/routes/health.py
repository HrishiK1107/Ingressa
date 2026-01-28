import logging

from fastapi import APIRouter

router = APIRouter(tags=["health"])
log = logging.getLogger("ingressa.health")


@router.get("/health")
def health():
    log.info("health check ok")
    return {"status": "ok"}
