import datetime
from gettext import gettext as _
from typing import Optional

from asyncpg.exceptions import UniqueViolationError  # type: ignore
from fastapi import Depends
from fastapi.security import APIKeyHeader
from passlib import pwd  # type: ignore
from passlib.context import CryptContext  # type: ignore
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.exceptions import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from fanviddb.db import get_async_session

from . import models

X_API_KEY = APIKeyHeader(name="X-API-Key", auto_error=False)
api_key_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def generate(session: AsyncSession) -> str:
    api_key = None
    attempts = 0
    while api_key is None:
        pk = pwd.genword(length=8, charset="ascii_50")
        secret = pwd.genword(entropy="secure", charset="ascii_50")
        api_key = f"{pk}_{secret}"

        instance = models.ApiKeyTable(
            pk=pk,
            hashed_api_key=api_key_context.hash(api_key),
            created_timestamp=datetime.datetime.utcnow(),
            state="active",
        )
        async with session.begin_nested() as nested:
            try:
                session.add(instance)
                await nested.commit()
            except IntegrityError as exc:
                await nested.rollback()
                # This is necessary because of how sqlalchemy currently
                # nests errors.
                if exc.orig.sqlstate != UniqueViolationError.sqlstate:
                    raise
                api_key = None
        attempts += 1
        if attempts > 10:
            raise ValueError(_("Too many collisions"))

    return api_key


async def verify(session: AsyncSession, api_key: str):
    try:
        pk, _ = api_key.split("_")
    except ValueError:
        return False
    query = select([models.api_keys]).where(models.api_keys.c.pk == pk)
    result = await session.execute(query)
    row = result.first()
    if row is None:
        return False
    return api_key_context.verify(api_key, row.hashed_api_key)


async def check_api_key_header(
    session: AsyncSession = Depends(get_async_session),
    api_key: Optional[str] = Depends(X_API_KEY),
):
    # If no API key is present, that's fine; however, an invalid or revoked api key
    # is always an error.
    if api_key is None:
        return False
    is_valid = await verify(session, api_key)
    if not is_valid:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail=_("Invalid api key")
        )
    return True
