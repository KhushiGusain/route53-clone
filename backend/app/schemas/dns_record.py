from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class RecordType(str, Enum):
    A = "A"
    CNAME = "CNAME"
    MX = "MX"
    TXT = "TXT"
    NS = "NS"
    SOA = "SOA"


class DNSRecordCreate(BaseModel):
    name: str
    type: RecordType
    value: str
    ttl: int


class DNSRecordUpdate(BaseModel):
    name: str | None = None
    type: RecordType | None = None
    value: str | None = None
    ttl: int | None = None


class DNSRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    hosted_zone_id: int
    name: str
    type: RecordType
    value: str
    ttl: int
    created_at: datetime
    updated_at: datetime
