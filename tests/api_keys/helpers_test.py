import datetime

import pytest
from sqlalchemy import select

from fanviddb.api_keys import db
from fanviddb.api_keys.helpers import api_key_context
from fanviddb.api_keys.helpers import generate
from fanviddb.api_keys.helpers import verify
from fanviddb.db import database


@pytest.mark.asyncio
async def test_generate(app):
    api_key = await generate()
    pk, _ = api_key.split("_")
    query = select([db.api_keys]).where(db.api_keys.c.pk == pk)
    result = await database.fetch_one(query)
    assert api_key_context.verify(api_key, result["hashed_api_key"])


@pytest.mark.asyncio
async def test_generate__conflict(app, mocker):
    query = db.api_keys.insert().values(
        pk="pkone",
        hashed_api_key="whatever",
        created_timestamp=datetime.datetime.utcnow(),
    )
    await database.execute(query)
    mocked_genword = mocker.patch(
        "fanviddb.api_keys.helpers.pwd.genword",
        side_effect=[
            "pkone",
            "secretone",
            "pktwo",
            "secrettwo",
        ],
    )
    api_key = await generate()
    assert mocked_genword.call_count > 2
    assert api_key is not None


@pytest.mark.asyncio
async def test_generate__permaconflict(app, mocker):
    # Simulate high frequency of collisions (though that should only happen
    # with 15 trillion+ api keys)
    query = db.api_keys.insert().values(
        pk="pkone",
        hashed_api_key="whatever",
        created_timestamp=datetime.datetime.utcnow(),
    )
    await database.execute(query)
    mocked_genword = mocker.patch(
        "fanviddb.api_keys.helpers.pwd.genword", side_effect=lambda *_, **__: "pkone"
    )
    with pytest.raises(ValueError) as exc_info:
        await generate()

    assert "collisions" in str(exc_info.value)
    assert mocked_genword.call_count > 20


@pytest.mark.asyncio
async def test_verify__correct(app):
    api_key = await generate()
    assert await verify(api_key)


@pytest.mark.asyncio
async def test_verify__incorrect(app):
    api_key = await generate()
    assert not await verify(f"{api_key}1")


@pytest.mark.asyncio
async def test_verify__does_not_exist(app):
    assert not await verify("whatever_suibian")
