import pytest
from fastapi.encoders import jsonable_encoder
from sqlalchemy.sql import select

from fanviddb.db import database
from fanviddb.fanvids.db import fanvids
from fanviddb.fanvids.models import Fanvid

from ..factories import FanvidFactory


@pytest.mark.asyncio
async def test_create_fanvid(logged_in_client):
    expected_data = jsonable_encoder(FanvidFactory.build())
    expected_data.pop("uuid")
    expected_data["audio"] = {
        "title": expected_data.pop("audio_title"),
        "artists_or_sources": expected_data.pop("audio_artists_or_sources"),
        "language": expected_data.pop("audio_language"),
    }
    response = await logged_in_client.post(
        "/fanvids",
        json=expected_data,
    )
    assert response.status_code == 201, response.json()
    response_data = response.json()
    expected_data.update(
        {
            "uuid": response_data["uuid"],
            "created_timestamp": response_data["created_timestamp"],
            "modified_timestamp": response_data["modified_timestamp"],
        }
    )
    assert response_data == expected_data
    query = select([fanvids])
    result = [dict(row) for row in await database.fetch_all(query)]
    assert len(result) == 1

    result[0]["audio"] = {
        "title": result[0].pop("audio_title"),
        "artists_or_sources": result[0].pop("audio_artists_or_sources"),
        "language": result[0].pop("audio_language"),
    }
    assert jsonable_encoder(Fanvid(**result[0])) == expected_data


@pytest.mark.asyncio
async def test_create_fanvid__logged_out(fastapi_client):
    expected_data = jsonable_encoder(FanvidFactory.build())
    expected_data.pop("uuid")
    expected_data["audio"] = {
        "title": expected_data.pop("audio_title"),
        "artists_or_sources": expected_data.pop("audio_artists_or_sources"),
        "language": expected_data.pop("audio_language"),
    }
    response = await fastapi_client.post(
        "/fanvids",
        json=expected_data,
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_fanvids(fastapi_client):
    fanvid = await FanvidFactory()
    expected_response = jsonable_encoder(fanvid)
    expected_response["audio"] = {
        "title": expected_response.pop("audio_title"),
        "artists_or_sources": expected_response.pop("audio_artists_or_sources"),
        "language": expected_response.pop("audio_language"),
    }
    response = await fastapi_client.get("/fanvids")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 1
    assert response_data[0] == expected_response


@pytest.mark.asyncio
async def test_list_fanvids__excludes_deleted(fastapi_client):
    await FanvidFactory(state="deleted")
    response = await fastapi_client.get("/fanvids")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 0


@pytest.mark.asyncio
async def test_read_fanvid(fastapi_client):
    fanvid = await FanvidFactory()
    expected_response = jsonable_encoder(fanvid)
    expected_response["audio"] = {
        "title": expected_response.pop("audio_title"),
        "artists_or_sources": expected_response.pop("audio_artists_or_sources"),
        "language": expected_response.pop("audio_language"),
    }
    response = await fastapi_client.get(f"/fanvids/{str(fanvid['uuid'])}")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data == expected_response


@pytest.mark.asyncio
async def test_read_fanvid__404(fastapi_client):
    response = await fastapi_client.get("/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_fanvid(fastapi_client):
    fanvid = await FanvidFactory()
    expected_response = jsonable_encoder(fanvid)
    expected_response["audio"] = {
        "title": expected_response.pop("audio_title"),
        "artists_or_sources": expected_response.pop("audio_artists_or_sources"),
        "language": expected_response.pop("audio_language"),
    }
    expected_response["title"] = f"{expected_response['title']} and then some"
    response = await fastapi_client.patch(
        f"/fanvids/{str(fanvid['uuid'])}",
        json={
            "title": expected_response["title"],
        },
    )
    assert response.status_code == 200
    response_data = response.json()
    assert response_data.pop("modified_timestamp") > expected_response.pop(
        "modified_timestamp"
    )
    assert response_data == expected_response


@pytest.mark.asyncio
async def test_update_fanvid__404(fastapi_client):
    response = await fastapi_client.patch(
        "/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6",
        json={
            "title": "string",
        },
    )
    assert response.status_code == 404
