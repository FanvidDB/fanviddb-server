import datetime

import pytest
from sqlalchemy import select
from starlette.exceptions import HTTPException

from fanviddb.api_keys.helpers import api_key_context
from fanviddb.api_keys.helpers import check_api_key_header
from fanviddb.api_keys.helpers import generate
from fanviddb.api_keys.helpers import verify
from fanviddb.api_keys.models import ApiKeyTable
from fanviddb.api_keys.models import api_keys


@pytest.mark.asyncio
async def test_generate(db_session):
    api_key = await generate(db_session)
    pk, _ = api_key.split("_")
    query = select([api_keys]).where(api_keys.c.pk == pk)
    result = await db_session.execute(query)
    row = result.first()
    assert api_key_context.verify(api_key, row.hashed_api_key)


@pytest.mark.asyncio
async def test_generate__conflict(db_session, mocker):
    instance = ApiKeyTable(
        pk="pkone",
        hashed_api_key="whatever",
        created_timestamp=datetime.datetime.utcnow(),
    )
    db_session.add(instance)
    await db_session.commit()
    # Clear the instance out of the session because otherwise sqlalchemy will
    # very nicely warn us about the brewing conflict (unnecessary.)
    db_session.expunge(instance)
    mocked_genword = mocker.patch(
        "fanviddb.api_keys.helpers.pwd.genword",
        side_effect=[
            "pkone",
            "secretone",
            "pktwo",
            "secrettwo",
        ],
    )
    api_key = await generate(db_session)
    assert mocked_genword.call_count > 2
    assert api_key is not None


@pytest.mark.asyncio
async def test_generate__permaconflict(db_session, mocker):
    # Simulate high frequency of collisions (though that should only happen
    # with 15 trillion+ api keys)
    instance = ApiKeyTable(
        pk="pkone",
        hashed_api_key="whatever",
        created_timestamp=datetime.datetime.utcnow(),
    )
    db_session.add(instance)
    await db_session.commit()
    # Clear the instance out of the session because otherwise sqlalchemy will
    # very nicely warn us about the brewing conflict (unnecessary.)
    db_session.expunge(instance)
    mocked_genword = mocker.patch(
        "fanviddb.api_keys.helpers.pwd.genword", side_effect=lambda *_, **__: "pkone"
    )
    with pytest.raises(ValueError) as exc_info:
        await generate(db_session)

    assert "collisions" in str(exc_info.value)
    assert mocked_genword.call_count > 20


@pytest.mark.asyncio
async def test_verify__correct(db_session):
    api_key = await generate(db_session)
    assert await verify(db_session, api_key)


@pytest.mark.asyncio
async def test_verify__incorrect(db_session):
    api_key = await generate(db_session)
    assert not await verify(db_session, f"{api_key}1")


@pytest.mark.asyncio
async def test_verify__does_not_exist(db_session):
    assert not await verify(db_session, "whatever_suibian")


@pytest.mark.asyncio
async def test_verify__invalid(db_session):
    assert not await verify(db_session, "junkdata")


@pytest.mark.asyncio
async def test_check_api_key_header__valid(db_session):
    api_key = await generate(db_session)
    assert await check_api_key_header(db_session, api_key)


@pytest.mark.asyncio
async def test_check_api_key_header__unset(db_session):
    assert not await check_api_key_header(db_session, None)


@pytest.mark.asyncio
async def test_check_api_key_header__invalid(db_session):
    api_key = await generate(db_session)
    with pytest.raises(HTTPException) as exc_info:
        await check_api_key_header(db_session, api_key + "hi")

    assert exc_info.value.status_code == 401
