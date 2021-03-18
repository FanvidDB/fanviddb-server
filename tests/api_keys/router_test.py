import pytest
from sqlalchemy import select

from fanviddb.api_keys import db
from fanviddb.api_keys.helpers import api_key_context
from fanviddb.db import database


@pytest.mark.asyncio
async def test_create_api_key(fastapi_client):
    response = await fastapi_client.post("/api_keys")
    assert response.status_code == 200
    api_key = response.json()["api_key"]
    pk, _ = api_key.split("_")
    query = select([db.api_keys]).where(db.api_keys.c.pk == pk)
    result = await database.fetch_one(query)
    assert api_key_context.verify(api_key, result["hashed_api_key"])
