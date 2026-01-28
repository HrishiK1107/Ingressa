from typing import Optional

from pydantic import BaseModel, ConfigDict


class APIModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class HealthOut(APIModel):
    status: str


class ErrorOut(APIModel):
    detail: str


class Pagination(APIModel):
    page: int = 1
    page_size: int = 50
    total: int = 0


class ListResponse(APIModel):
    items: list
    pagination: Optional[Pagination] = None
