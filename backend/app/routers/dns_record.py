from collections.abc import Generator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.schemas.dns_record import (
    DNSRecordCreate,
    DNSRecordResponse,
    DNSRecordUpdate,
)
from app.services import dns_record_service, hosted_zone_service

router = APIRouter()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _ensure_hosted_zone_exists(db: Session, hosted_zone_id: int) -> None:
    hosted_zone = hosted_zone_service.get_hosted_zone_by_id(db, hosted_zone_id)
    if not hosted_zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found",
        )


@router.get(
    "/hosted-zones/{hosted_zone_id}/records",
    response_model=list[DNSRecordResponse],
)
def list_dns_records(hosted_zone_id: int, db: Session = Depends(get_db)):
    _ensure_hosted_zone_exists(db, hosted_zone_id)
    return dns_record_service.get_all_dns_records(db, hosted_zone_id)


@router.get(
    "/hosted-zones/{hosted_zone_id}/records/{record_id}",
    response_model=DNSRecordResponse,
)
def get_dns_record(hosted_zone_id: int, record_id: int, db: Session = Depends(get_db)):
    _ensure_hosted_zone_exists(db, hosted_zone_id)

    record = dns_record_service.get_dns_record_by_id(db, hosted_zone_id, record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS record not found",
        )
    return record


@router.post(
    "/hosted-zones/{hosted_zone_id}/records",
    response_model=DNSRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_dns_record(
    hosted_zone_id: int,
    record_data: DNSRecordCreate,
    db: Session = Depends(get_db),
):
    _ensure_hosted_zone_exists(db, hosted_zone_id)
    return dns_record_service.create_dns_record(db, hosted_zone_id, record_data)


@router.put(
    "/hosted-zones/{hosted_zone_id}/records/{record_id}",
    response_model=DNSRecordResponse,
)
def update_dns_record(
    hosted_zone_id: int,
    record_id: int,
    record_data: DNSRecordUpdate,
    db: Session = Depends(get_db),
):
    _ensure_hosted_zone_exists(db, hosted_zone_id)

    record = dns_record_service.update_dns_record(
        db, hosted_zone_id, record_id, record_data
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS record not found",
        )
    return record


@router.delete(
    "/hosted-zones/{hosted_zone_id}/records/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_dns_record(
    hosted_zone_id: int, record_id: int, db: Session = Depends(get_db)
):
    _ensure_hosted_zone_exists(db, hosted_zone_id)

    deleted = dns_record_service.delete_dns_record(db, hosted_zone_id, record_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS record not found",
        )
