import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.models import Asset
from app.schemas.assets import AssetOut

router = APIRouter(prefix="/assets", tags=["assets"])
log = logging.getLogger("ingressa.assets")


@router.get("", response_model=List[AssetOut])
def list_assets(
    db: Session = Depends(get_db),
    asset_type: Optional[str] = Query(default=None),
    region: Optional[str] = Query(default=None),
    q: Optional[str] = Query(default=None, description="search by asset_id or name"),
):
    query = db.query(Asset)

    if asset_type:
        query = query.filter(Asset.asset_type == asset_type)
    if region:
        query = query.filter(Asset.region == region)
    if q:
        like = f"%{q}%"
        query = query.filter((Asset.asset_id.ilike(like)) | (Asset.name.ilike(like)))

    assets = query.order_by(Asset.asset_type.asc(), Asset.asset_id.asc()).limit(500).all()
    return assets
