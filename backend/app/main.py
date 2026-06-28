from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.connection import engine
from app.models import dns_record, hosted_zone  # noqa: F401
from app.routers.auth import router as auth_router
from app.routers.dns_record import router as dns_record_router
from app.routers.hosted_zone import router as hosted_zone_router

app = FastAPI()


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://route53-clone-phi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(hosted_zone_router)
app.include_router(dns_record_router)


@app.get("/")
def read_root():
    return {"message": "Route53 Clone API"}
