from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

ZoneType = Literal["Public", "Private"]


class HostedZoneCreate(BaseModel):
    name: str
    type: ZoneType = "Public"
    description: str | None = None


class HostedZoneUpdate(BaseModel):
    description: str | None = None


class HostedZoneResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    type: ZoneType
    description: str | None
    created_by: str
    hosted_zone_id: str
    created_at: datetime
    record_count: int
