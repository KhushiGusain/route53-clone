import secrets
import string

from sqlalchemy.orm import Session, selectinload

from app.models.hosted_zone import HostedZone
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate
from app.services import dns_record_service


def _generate_hosted_zone_id(db: Session) -> str:
    alphabet = string.ascii_uppercase + string.digits

    while True:
        hosted_zone_id = "Z" + "".join(secrets.choice(alphabet) for _ in range(13))
        exists = (
            db.query(HostedZone)
            .filter(HostedZone.hosted_zone_id == hosted_zone_id)
            .first()
        )
        if not exists:
            return hosted_zone_id


def _hosted_zone_query(db: Session):
    return db.query(HostedZone).options(selectinload(HostedZone.records))


def create_hosted_zone(db: Session, zone_data: HostedZoneCreate) -> HostedZone:
    hosted_zone = HostedZone(
        name=zone_data.name,
        type=zone_data.type,
        description=zone_data.description,
        hosted_zone_id=_generate_hosted_zone_id(db),
    )

    db.add(hosted_zone)
    db.flush()

    dns_record_service.create_default_dns_records(db, hosted_zone.id)

    db.commit()
    return get_hosted_zone_by_id(db, hosted_zone.id)


def get_all_hosted_zones(db: Session) -> list[HostedZone]:
    return _hosted_zone_query(db).order_by(HostedZone.created_at.desc()).all()


def get_hosted_zone_by_id(db: Session, zone_id: int) -> HostedZone | None:
    return _hosted_zone_query(db).filter(HostedZone.id == zone_id).first()


def update_hosted_zone(
    db: Session, zone_id: int, zone_data: HostedZoneUpdate
) -> HostedZone | None:
    hosted_zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not hosted_zone:
        return None

    updates = zone_data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(hosted_zone, field, value)

    db.commit()
    return get_hosted_zone_by_id(db, zone_id)


def delete_hosted_zone(db: Session, zone_id: int) -> bool:
    hosted_zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not hosted_zone:
        return False

    db.delete(hosted_zone)
    db.commit()
    return True
