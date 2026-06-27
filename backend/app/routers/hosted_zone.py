from collections.abc import Generator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.schemas.hosted_zone import (
    HostedZoneCreate,
    HostedZoneResponse,
    HostedZoneUpdate,
)
from app.services import hosted_zone_service

router = APIRouter()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/hosted-zones", response_model=list[HostedZoneResponse])
def list_hosted_zones(db: Session = Depends(get_db)):
    return hosted_zone_service.get_all_hosted_zones(db)


@router.post(
    "/hosted-zones",
    response_model=HostedZoneResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_hosted_zone(
    zone_data: HostedZoneCreate, db: Session = Depends(get_db)
):
    return hosted_zone_service.create_hosted_zone(db, zone_data)


@router.get("/hosted-zones/{zone_id}", response_model=HostedZoneResponse)
def get_hosted_zone(zone_id: int, db: Session = Depends(get_db)):
    hosted_zone = hosted_zone_service.get_hosted_zone_by_id(db, zone_id)
    if not hosted_zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found",
        )
    return hosted_zone


@router.put("/hosted-zones/{zone_id}", response_model=HostedZoneResponse)
def update_hosted_zone(
    zone_id: int,
    zone_data: HostedZoneUpdate,
    db: Session = Depends(get_db),
):
    hosted_zone = hosted_zone_service.update_hosted_zone(db, zone_id, zone_data)
    if not hosted_zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found",
        )
    return hosted_zone


@router.delete("/hosted-zones/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hosted_zone(zone_id: int, db: Session = Depends(get_db)):
    deleted = hosted_zone_service.delete_hosted_zone(db, zone_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found",
        )
