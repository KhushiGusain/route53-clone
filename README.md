# Route 53 Clone

A full-stack DNS management console inspired by AWS Route 53. Create hosted zones, manage DNS records, search and paginate results, and edit records inline — with an AWS-style UI.

## Features

### Hosted Zones
- View hosted zones
- Create hosted zones
- Edit hosted zones
- Delete hosted zones
- Search & filter
- Pagination
- Hosted zone details

### DNS Records
- View DNS records
- Create one or multiple DNS records
- Edit DNS records
- Delete one or multiple DNS records
- Automatic NS & SOA record creation
- Record details sidebar

---

## Live Demo

| Service | URL |
|----------|-----|
| **Frontend** | https://route53-clone-phi.vercel.app/login |
| **Swagger API Docs** | https://route53-backend-gq8z.onrender.com/docs |

**Note:** **The initial load may take a few minutes because of the hosting setup. If the issue persists, refresh the page and try again.**

---

## Setup

### Prerequisites

- Python 3.11+
- Node.js 20+

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The SQLite database (`route53.db`) is created automatically on first startup.

### Frontend

```bash
cd frontend/my-app
npm install
```

Create `frontend/my-app/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 and sign in with the credentials above.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Next.js)                    │
│  App Router · React 19 · Tailwind CSS · Client API lib  │
└──────────────────────────┬──────────────────────────────┘
                           │ REST (JSON)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                       │
│  Routers → Services → SQLAlchemy ORM                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
                    SQLite (route53.db)
```

| Layer | Stack |
|---|---|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS 4 |
| **Backend** | FastAPI, Pydantic, SQLAlchemy |
| **Database** | SQLite |
| **Auth** | Mock username/password (client-side session) |

### Project structure

```
route53-clone/
├── backend/
│   └── app/
│       ├── routers/       # HTTP endpoints
│       ├── services/      # Business logic
│       ├── models/        # SQLAlchemy models
│       └── schemas/       # Request/response schemas
└── frontend/my-app/
    ├── app/               # Next.js pages (App Router)
    ├── components/        # UI components
    └── lib/               # API client, types, helpers
```

---

## Database schema

### `hosted_zones`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key |
| `name` | VARCHAR | Unique domain name |
| `type` | VARCHAR | `Public` or `Private` |
| `description` | VARCHAR | Optional |
| `created_by` | VARCHAR | Default: `Route53` |
| `hosted_zone_id` | VARCHAR | Unique AWS-style ID (e.g. `Z1A2B3C4D5E6F7`) |
| `created_at` | DATETIME | UTC timestamp |

### `dns_records`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key |
| `hosted_zone_id` | INTEGER | FK → `hosted_zones.id` (cascade delete) |
| `name` | VARCHAR | Record name (`@` = root) |
| `type` | VARCHAR | `A`, `CNAME`, `MX`, `TXT`, `NS`, `SOA` |
| `value` | TEXT | Record value |
| `ttl` | INTEGER | Time to live (seconds) |
| `created_at` | DATETIME | UTC timestamp |
| `updated_at` | DATETIME | UTC timestamp |

**Relationships:** One hosted zone has many DNS records. Creating a zone automatically seeds default `NS` and `SOA` records.

---

## API overview

Base URL: `http://localhost:8000`

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/login` | Authenticate (`username`, `password`) |

### Hosted zones

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/hosted-zones` | List all zones |
| `POST` | `/hosted-zones` | Create a zone |
| `GET` | `/hosted-zones/{id}` | Get zone by ID |
| `PUT` | `/hosted-zones/{id}` | Update zone description |
| `DELETE` | `/hosted-zones/{id}` | Delete zone and its records |

### DNS records

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/hosted-zones/{id}/records` | List records in a zone |
| `POST` | `/hosted-zones/{id}/records` | Create a record |
| `GET` | `/hosted-zones/{id}/records/{record_id}` | Get a record |
| `PUT` | `/hosted-zones/{id}/records/{record_id}` | Update value / TTL |
| `DELETE` | `/hosted-zones/{id}/records/{record_id}` | Delete a record |

Interactive docs: https://route53-backend-gq8z.onrender.com/docs

---

