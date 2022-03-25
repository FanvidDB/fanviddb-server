import pytest
from sqlalchemy import select

from fanviddb.api_keys.helpers import api_key_context
from fanviddb.api_keys.models import api_keys


@pytest.mark.asyncio
async def test_create_api_key(db_session, fastapi_client):
    response = await fastapi_client.post("/api/api_keys")
    assert response.status_code == 200
    api_key = response.json()["api_key"]
    pk, _ = api_key.split("_")
    query = select([api_keys]).where(api_keys.c.pk == pk)
    result = await db_session.execute(query)
    row = result.first()
    assert api_key_context.verify(api_key, row.hashed_api_key)
