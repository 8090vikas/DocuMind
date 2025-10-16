## DocuMind Backend (Simplified)

FastAPI backend for document upload, parsing, vector search, and chat over PDFs.

### Quick Start

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export $(cat .env | xargs) # or set env vars manually
uvicorn app.main:app --reload
```

### Folder Structure

```text
Backend/
├── app/
│   ├── main.py                 # FastAPI app creation + router include
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── dependencies.py     # Shared deps (DB session, auth, pagination)
│   │   └── v1/
│   │       ├── routes_auth.py  # Login, token issuance
│   │       ├── routes_user.py  # User CRUD/profile endpoints
│   │       └── routes_docs.py  # Document upload, parse, search, chat
│   │
│   ├── core/
│   │   ├── config.py           # Settings from environment (.env)
│   │   ├── security.py         # Hashing, JWT helpers
│   │   └── logger.py           # App logger configuration
│   │
│   ├── models/
│   │   ├── base.py             # SQLAlchemy Base
│   │   ├── user.py             # User model
│   │   └── document.py         # Document model
│   │
│   ├── schemas/
│   │   ├── user_schema.py      # Pydantic schemas (request/response)
│   │   ├── document_schema.py
│   │   └── auth_schema.py
│   │
│   ├── services/
│   │   ├── user_service.py     # Business logic for users
│   │   └── document_service.py # Parse, chunk, embed, search, chat
│   │
│   └── db/
│       ├── base_class.py       # Base class helpers
│       └── session.py          # DB engine/session factory
│
├── tests/                      # Pytest tests
├── requirements.txt
├── .env                        # Runtime env vars (local)
└── run.py                      # Optional entry executable
```

### End-to-End Request Flow

- 1) HTTP request hits `app/main.py`
  - Creates FastAPI `app`
  - Includes versioned routers from `app/api/v1/*`

- 2) Router layer (e.g., `app/api/v1/routes_docs.py`)
  - Defines endpoints: upload, parse, search, chat
  - Injects dependencies from `app/api/dependencies.py` (e.g., `get_db`, `get_current_user`)

- 3) Dependency layer `app/api/dependencies.py`
  - Provides DB session (`SessionLocal` from `app/db/session.py`)
  - Provides auth context (from `app/core/security.py`)

- 4) Service layer (e.g., `app/services/document_service.py`)
  - Implements business logic: file validation, text extraction, chunking, embeddings, vector search, LLM response generation
  - Uses configuration from `app/core/config.py` (API keys, model names, storage paths)

- 5) Data layer
  - SQLAlchemy models in `app/models/*`
  - Session/engine in `app/db/session.py`

- 6) Schemas
  - Request/response validation via `app/schemas/*`

- 7) Response
  - Router returns Pydantic models or primitives; FastAPI serializes to JSON

### Who Calls What (Cheat Sheet)

- `app/main.py`
  - includes → `app/api/v1/routes_auth.py`, `routes_user.py`, `routes_docs.py`
  - uses → `app/core/config.py` for settings, `app/core/logger.py` for logging

- `app/api/v1/routes_*.py`
  - depend → `app/api/dependencies.py` (e.g., `get_db`, `get_current_user`)
  - call → `app/services/user_service.py` or `app/services/document_service.py`
  - use → `app/schemas/*` for request/response models

- `app/api/dependencies.py`
  - use → `app/db/session.py` to yield `Session`
  - use → `app/core/security.py` for JWT/auth

- `app/services/*.py`
  - use → `app/models/*` for ORM
  - use → `app/core/config.py` for env-backed settings
  - may use → external LLM/vector libs via adapters

- `app/core/*`
  - `config.py` loads `.env`
  - `security.py` handles hashing/JWT
  - `logger.py` configures logging

### Environment Variables

Put secrets and config in `.env` (never commit real secrets). Common keys:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `EMBEDDING_MODEL`
- `JWT_SECRET` / `JWT_ALGORITHM`
- `STORAGE_DIR`

### Common Commands

```bash
# run dev server
uvicorn app.main:app --reload

# run tests
pytest -q
```

### Notes

- Keep endpoints thin; put logic in `services/`.
- Keep request/response contracts in `schemas/`.
- Use `dependencies.py` to avoid repeating boilerplate (DB/auth).
