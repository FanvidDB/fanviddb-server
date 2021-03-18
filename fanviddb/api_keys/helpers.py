import datetime
from typing import Optional

from asyncpg.exceptions import UniqueViolationError  # type: ignore
from fastapi import Depends
from fastapi.security import APIKeyHeader
from passlib import pwd  # type: ignore
from passlib.context import CryptContext  # type: ignore
from sqlalchemy import select
from starlette.exceptions import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from fanviddb.db import database

from . import db

X_API_KEY = APIKeyHeader(name="X-API-Key")
api_key_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def generate() -> str:
    api_key = None
    attempts = 0
    while api_key is None:
        pk = pwd.genword(length=8, charset="ascii_50")
        secret = pwd.genword(entropy="secure", charset="ascii_50")
        api_key = f"{pk}_{secret}"

        query = db.api_keys.insert().values(
            pk=pk,
            hashed_api_key=api_key_context.hash(api_key),
            created_timestamp=datetime.datetime.utcnow(),
            state="active",
        )
        transaction = await database.transaction()
        try:
            await database.execute(query)
        except UniqueViolationError:
            api_key = None
            await transaction.rollback()
        else:
            await transaction.commit()
        attempts += 1
        if attempts > 10:
            raise ValueError("Too many collisions")

    return api_key


async def verify(api_key: str):
    pk, _ = api_key.split("_")
    query = select([db.api_keys]).where(db.api_keys.c.pk == pk)
    result = await database.fetch_one(query)
    if result is None:
        return False
    return api_key_context.verify(api_key, result["hashed_api_key"])


async def check_api_key_header(api_key: Optional[str] = Depends(X_API_KEY)):
    # If no API key is present, that's fine; however, an invalid or revoked api key
    # is always an error.
    if api_key is None:
        return False
    is_valid = await verify(api_key)
    if not is_valid:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid api key")
    return True
