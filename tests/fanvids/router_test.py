import pytest
from fastapi.encoders import jsonable_encoder
from sqlalchemy.sql import select

from fanviddb.api_keys.helpers import generate as generate_api_key
from fanviddb.db import database
from fanviddb.fanvids.db import _to_api
from fanviddb.fanvids.db import fanvids
from fanviddb.fanvids.db import update_fanvid
from fanviddb.fanvids.models import Fanvid
from fanviddb.fanvids.models import FanvidWithRelevance
from fanviddb.fanvids.models import UpdateFanvid

from ..factories import FanvidFactory

RELEVANCE_UNSET = object()


def _serialize_fanvid(fanvid, relevance=RELEVANCE_UNSET):
    """Converts a return value from FanvidFactory / the database into an expected json response"""
    fanvid_class = Fanvid
    if relevance != RELEVANCE_UNSET:
        fanvid["relevance"] = relevance
        fanvid_class = FanvidWithRelevance
    serialized = _to_api(fanvid)
    return jsonable_encoder(fanvid_class(**serialized))


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
            "state": "active",
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
    expected_fanvid = _serialize_fanvid(fanvid, relevance=None)
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
    expected_fanvid = _serialize_fanvid(fanvid, relevance=None)
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
    await FanvidFactory()
    response = await fastapi_client.get(
        "/api/fanvids", headers={"X-API-Key": "nonsenseheader"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_fanvids__unauthenticated(fastapi_client):
    await FanvidFactory()
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
    expected_fanvids = [
        _serialize_fanvid(f, relevance=None) for f in reversed(fanvids[5:])
    ]
    assert response_data["total_count"] == 10
    assert len(response_data["fanvids"]) == 5
    assert response_data["fanvids"] == expected_fanvids


@pytest.mark.asyncio
async def test_list_fanvids__offset(logged_in_client):
    fanvids = await FanvidFactory.create_batch(10)
    response = await logged_in_client.get("/api/fanvids?offset=2")
    assert response.status_code == 200
    response_data = response.json()
    expected_fanvids = [
        _serialize_fanvid(f, relevance=None) for f in reversed(fanvids[:-2])
    ]
    assert response_data["total_count"] == 10
    assert len(response_data["fanvids"]) == 8
    assert response_data["fanvids"] == expected_fanvids


@pytest.mark.asyncio
async def test_list_fanvids__limit_and_offset(logged_in_client):
    fanvids = await FanvidFactory.create_batch(10)
    response = await logged_in_client.get("/api/fanvids?limit=5&offset=2")
    assert response.status_code == 200
    response_data = response.json()
    expected_fanvids = [
        _serialize_fanvid(f, relevance=None) for f in reversed(fanvids[3:-2])
    ]
    assert response_data["total_count"] == 10
    assert len(response_data["fanvids"]) == 5
    assert response_data["fanvids"] == expected_fanvids


@pytest.mark.asyncio
async def test_list_fanvids__filename_search(logged_in_client):
    fanvid1 = await FanvidFactory(
        title="Hello",
        creators=["World"],
        fandoms=["foo"],
        unique_identifiers=[{"kind": "youtube", "identifier": "bar"}],
    )
    fanvid2 = await FanvidFactory(
        title="Hello",
        creators=["World"],
        fandoms=["whatever"],
        unique_identifiers=[{"kind": "youtube", "identifier": "bar"}],
    )
    fanvid3 = await FanvidFactory(
        title="Goodnight",
        creators=["World"],
        fandoms=["whatever"],
        unique_identifiers=[{"kind": "youtube", "identifier": "suibian"}],
    )
    fanvid4 = await FanvidFactory(
        title="Irrelevant",
        creators=["other"],
        fandoms=["parrot"],
        unique_identifiers=[],
    )

    # Trigger search doc update.
    for fanvid in (fanvid1, fanvid2, fanvid3, fanvid4):
        await update_fanvid(
            fanvid_uuid=fanvid["uuid"], fanvid=UpdateFanvid(title=fanvid["title"])
        )

    filename = "whatever - Hello - World [bar].mp4"

    response = await logged_in_client.get("/api/fanvids", params={"filename": filename})
    assert response.status_code == 200
    response_data = response.json()
    expected_fanvids = [fanvid2, fanvid1, fanvid3]
    assert response_data["total_count"] == 3
    assert len(response_data["fanvids"]) == 3
    assert all([fanvid["relevance"] for fanvid in response_data["fanvids"]])
    response_uuids = [fanvid["uuid"] for fanvid in response_data["fanvids"]]
    expected_uuids = [str(fanvid["uuid"]) for fanvid in expected_fanvids]
    assert response_uuids == expected_uuids


@pytest.mark.asyncio
async def test_list_fanvids__disallow_negative_limit(logged_in_client):
    response = await logged_in_client.get("/api/fanvids?limit=-15")
    assert response.status_code == 422, response.json()


@pytest.mark.asyncio
async def test_list_fanvids__disallow_negative_offset(logged_in_client):
    response = await logged_in_client.get("/api/fanvids?offset=-15")
    assert response.status_code == 422, response.json()


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
