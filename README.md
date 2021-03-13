# fanviddb-server

This repository contains the codebase for the fanviddb server.

## Setup

1. Clone this repository. From inside the repository, run:

```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Install Postgres and create a database / user to connect to.
3. Create a `.env` file in the repository root that looks like this:

```
DATABASE_URL="postgresql://user:password@localhost/dbname"
```

4. Run alembic migrations with `alembic upgrade head`

## Running the server

```
uvicorn fanviddb.api:app --reload
```

This will automatically reload the server when your code changes.

## Running tests

```
pytest
```

## Running linters

```
make lint
```
