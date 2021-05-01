import pytest
from fastapi.encoders import jsonable_encoder
from sqlalchemy.sql import select

from fanviddb.api_keys.helpers import generate as generate_api_key
from fanviddb.db import database
from fanviddb.fanvids.db import fanvids
from fanviddb.fanvids.models import Fanvid

from ..factories import FanvidFactory


def _serialize_fanvid(fanvid):
    """Converts a return value from FanvidFactory / the database into an expected json response"""
    serialized = fanvid.copy()
    serialized["audio"] = {
        "title": serialized.pop("audio_title"),
        "artists_or_sources": serialized.pop("audio_artists_or_sources"),
        "language": serialized.pop("audio_language"),
    }
    return jsonable_encoder(Fanvid(**serialized))


@pytest.mark.asyncio
async def test_create_fanvid(logged_in_client):
    expected_data = _serialize_fanvid(FanvidFactory.build())
    expected_data.pop("uuid")
    expected_data.pop("state")
    response = await logged_in_client.post(
        "/api/fanvids",
        json=expected_data,
    )
    assert response.status_code == 201, response.json()
    response_data = response.json()
    expected_data.update(
        {
            "uuid": response_data["uuid"],
            "created_timestamp": response_data["created_timestamp"],
            "modified_timestamp": response_data["modified_timestamp"],
            "state": None,
        }
    )
    assert response_data == expected_data
    query = select([fanvids])
    result = [dict(row) for row in await database.fetch_all(query)]
    assert len(result) == 1
    assert _serialize_fanvid(result[0]) == expected_data


@pytest.mark.asyncio
async def test_create_fanvid__unauthenticated(fastapi_client):
    expected_data = _serialize_fanvid(FanvidFactory.build())
    expected_data.pop("uuid")
    response = await fastapi_client.post(
        "/api/fanvids",
        json=expected_data,
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_fanvids__user(logged_in_client):
    fanvid = await FanvidFactory()
    expected_fanvid = _serialize_fanvid(fanvid)
    expected_response = {
        "fanvids": [expected_fanvid],
        "total_count": 1,
    }
    response = await logged_in_client.get("/api/fanvids")
    assert response.status_code == 200, response.json()
    response_data = response.json()
    assert response_data == expected_response


@pytest.mark.asyncio
async def test_list_fanvids__api_key(fastapi_client):
    api_key = await generate_api_key()
    fanvid = await FanvidFactory()
    expected_fanvid = _serialize_fanvid(fanvid)
    expected_response = {
        "fanvids": [expected_fanvid],
        "total_count": 1,
    }
    response = await fastapi_client.get(
        "/api/fanvids",
        headers={"X-API-Key": api_key},
    )
    assert response.status_code == 200
    response_data = response.json()
    assert response_data == expected_response


@pytest.mark.asyncio
async def test_list_fanvids__invalid_api_key(fastapi_client):
    fanvid = await FanvidFactory()
    expected_response = _serialize_fanvid(fanvid)
    response = await fastapi_client.get(
        "/api/fanvids", headers={"X-API-Key": "nonsenseheader"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_fanvids__unauthenticated(fastapi_client):
    fanvid = await FanvidFactory()
    expected_response = _serialize_fanvid(fanvid)
    response = await fastapi_client.get("/api/fanvids")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_fanvids__excludes_deleted(logged_in_client):
    await FanvidFactory(state="deleted")
    response = await logged_in_client.get("/api/fanvids")
    assert response.status_code == 200
    response_data = response.json()
    expected_response = {"fanvids": [], "total_count": 0}
    assert response_data == expected_response


@pytest.mark.asyncio
async def test_list_fanvids__limit(logged_in_client):
    fanvids = await FanvidFactory.create_batch(10)
    response = await logged_in_client.get("/api/fanvids?limit=5")
    assert response.status_code == 200
    response_data = response.json()
    expected_fanvids = [_serialize_fanvid(f) for f in reversed(fanvids[5:])]
    assert response_data['total_count'] == 10
    assert len(response_data['fanvids']) == 5
    assert response_data['fanvids'] == expected_fanvids


@pytest.mark.asyncio
async def test_list_fanvids__offset(logged_in_client):
    fanvids = await FanvidFactory.create_batch(10)
    response = await logged_in_client.get("/api/fanvids?offset=2")
    assert response.status_code == 200
    response_data = response.json()
    expected_fanvids = [_serialize_fanvid(f) for f in reversed(fanvids[:-2])]
    assert response_data['total_count'] == 10
    assert len(response_data['fanvids']) == 8
    assert response_data['fanvids'] == expected_fanvids


@pytest.mark.asyncio
async def test_list_fanvids__limit_and_offset(logged_in_client):
    fanvids = await FanvidFactory.create_batch(10)
    response = await logged_in_client.get("/api/fanvids?limit=5&offset=2")
    assert response.status_code == 200
    response_data = response.json()
    expected_fanvids = [_serialize_fanvid(f) for f in reversed(fanvids[3:-2])]
    assert response_data['total_count'] == 10
    assert len(response_data['fanvids']) == 5
    assert response_data['fanvids'] == expected_fanvids


@pytest.mark.asyncio
async def test_read_fanvid(fastapi_client):
    fanvid = await FanvidFactory()
    expected_response = _serialize_fanvid(fanvid)
    response = await fastapi_client.get(f"/api/fanvids/{str(fanvid['uuid'])}")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data == expected_response


@pytest.mark.asyncio
async def test_read_fanvid__404(fastapi_client):
    response = await fastapi_client.get(
        "/api/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6"
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_fanvid(logged_in_client):
    fanvid = await FanvidFactory()
    expected_response = _serialize_fanvid(fanvid)
    expected_response["title"] = f"{expected_response['title']} and then some"
    response = await logged_in_client.patch(
        f"/api/fanvids/{str(fanvid['uuid'])}",
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
async def test_update_fanvid__unauthenticated(fastapi_client):
    fanvid = await FanvidFactory()
    expected_response = _serialize_fanvid(fanvid)
    expected_response["title"] = f"{expected_response['title']} and then some"
    response = await fastapi_client.patch(
        f"/api/fanvids/{str(fanvid['uuid'])}",
        json={
            "title": expected_response["title"],
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_fanvid__does_not_exist(logged_in_client):
    response = await logged_in_client.patch(
        "/api/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6",
        json={
            "title": "string",
        },
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_fanvid__does_not_exist__unauthenticated(fastapi_client):
    response = await fastapi_client.patch(
        "/api/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6",
        json={
            "title": "string",
        },
    )
    assert response.status_code == 401
