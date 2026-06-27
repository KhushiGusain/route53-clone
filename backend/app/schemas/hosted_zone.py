from datetime import datetime

from pydantic import BaseModel, ConfigDict


class HostedZoneCreate(BaseModel):
    name: str
    type: str = "Public"
    description: str | None = None


class HostedZoneUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    description: str | None = None


class HostedZoneResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    type: str
    description: str | None
    created_by: str
    hosted_zone_id: str
    created_at: datetime
