import datetime

from asyncpg.exceptions import UniqueViolationError  # type: ignore
from passlib import pwd  # type: ignore
from passlib.context import CryptContext  # type: ignore
from sqlalchemy import select

from fanviddb.db import database

from . import db

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


async def verify(api_key):
    pk, _ = api_key.split("_")
    query = select([db.api_keys]).where(db.api_keys.c.pk == pk)
    result = await database.fetch_one(query)
    if result is None:
        return False
    return api_key_context.verify(api_key, result["hashed_api_key"])
