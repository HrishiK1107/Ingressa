from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.config import settings

app = FastAPI(
    title="Ingressa API",
    version="0.1.0",
)

app.include_router(health_router)


@app.on_event("startup")
def startup():
    # Safe boot log (no secrets)
    print(
        f"[Ingressa] startup ok | mode={settings.SCAN_MODE} "
        f"| region={settings.AWS_REGION_DEFAULT} | auth={settings.AWS_AUTH_MODE}"
    )
