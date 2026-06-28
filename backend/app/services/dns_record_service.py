from sqlalchemy.orm import Session

from app.models.dns_record import DNSRecord
from app.schemas.dns_record import DNSRecordCreate, DNSRecordUpdate, RecordType

DEFAULT_DNS_RECORDS = (
    DNSRecordCreate(
        name="@",
        type=RecordType.NS,
        value="ns1.route53-clone.local",
        ttl=172800,
    ),
    DNSRecordCreate(
        name="@",
        type=RecordType.SOA,
        value="ns1.route53-clone.local admin.route53-clone.local",
        ttl=900,
    ),
)


def get_all_dns_records(db: Session, hosted_zone_id: int) -> list[DNSRecord]:
    return (
        db.query(DNSRecord)
        .filter(DNSRecord.hosted_zone_id == hosted_zone_id)
        .order_by(DNSRecord.created_at.desc())
        .all()
    )


def get_dns_record_by_id(
    db: Session, hosted_zone_id: int, record_id: int
) -> DNSRecord | None:
    return (
        db.query(DNSRecord)
        .filter(
            DNSRecord.id == record_id,
            DNSRecord.hosted_zone_id == hosted_zone_id,
        )
        .first()
    )


def create_dns_record(
    db: Session,
    hosted_zone_id: int,
    record_data: DNSRecordCreate,
    *,
    commit: bool = True,
) -> DNSRecord:
    record = DNSRecord(
        hosted_zone_id=hosted_zone_id,
        name=record_data.name,
        type=record_data.type.value,
        value=record_data.value,
        ttl=record_data.ttl,
    )

    db.add(record)

    if commit:
        db.commit()
        db.refresh(record)
    else:
        db.flush()

    return record


def create_default_dns_records(db: Session, hosted_zone_id: int) -> None:
    for record_data in DEFAULT_DNS_RECORDS:
        create_dns_record(db, hosted_zone_id, record_data, commit=False)


def update_dns_record(
    db: Session,
    hosted_zone_id: int,
    record_id: int,
    record_data: DNSRecordUpdate,
) -> DNSRecord | None:
    record = get_dns_record_by_id(db, hosted_zone_id, record_id)
    if not record:
        return None

    updates = record_data.model_dump(exclude_unset=True)
    if "type" in updates and updates["type"] is not None:
        updates["type"] = updates["type"].value

    for field, value in updates.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


def delete_dns_record(db: Session, hosted_zone_id: int, record_id: int) -> bool:
    record = get_dns_record_by_id(db, hosted_zone_id, record_id)
    if not record:
        return False

    db.delete(record)
    db.commit()
    return True
