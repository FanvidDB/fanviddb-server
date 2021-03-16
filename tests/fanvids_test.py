from fastapi.encoders import jsonable_encoder
from sqlalchemy import func
from sqlalchemy.sql import select

from fanviddb.db import database
from fanviddb.fanvids.db import fanvids

from .factories import FanvidFactory


def test_create_fanvid(fastapi_client, event_loop):
    response = fastapi_client.post(
        "/fanvids",
        json={
            "title": "string",
            "creators": ["string"],
            "premiere_date": "2021-03-14",
            "premiere_event": "string",
            "audio": {
                "title": "string",
                "artists_or_sources": [
                    "string",
                ],
                "language": "en-us",
            },
            "length": 0,
            "rating": "string",
            "fandoms": [],
            "summary": "string",
            "content_notes": [],
            "urls": [],
            "unique_identifiers": [],
            "thumbnail_url": "string",
            "state": "string",
        },
    )
    assert response.status_code == 201
    response.json()["uuid"]
    query = select([func.count()]).select_from(fanvids)
    result = event_loop.run_until_complete(database.fetch_one(query))
    assert result["count_1"] == 1


def test_list_fanvids(fastapi_client):
    fanvid = FanvidFactory()
    expected_response = jsonable_encoder(fanvid)
    expected_response["audio"] = {
        "title": expected_response.pop("audio_title"),
        "artists_or_sources": expected_response.pop("audio_artists_or_sources"),
        "language": expected_response.pop("audio_language"),
    }
    response = fastapi_client.get("/fanvids")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 1
    assert response_data[0] == expected_response


def test_read_fanvid(fastapi_client):
    fanvid = FanvidFactory()
    expected_response = jsonable_encoder(fanvid)
    expected_response["audio"] = {
        "title": expected_response.pop("audio_title"),
        "artists_or_sources": expected_response.pop("audio_artists_or_sources"),
        "language": expected_response.pop("audio_language"),
    }
    response = fastapi_client.get(f"/fanvids/{str(fanvid['uuid'])}")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data == expected_response


def test_read_fanvid__404(fastapi_client):
    response = fastapi_client.get("/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6")
    assert response.status_code == 404


def test_update_fanvid(fastapi_client):
    fanvid = FanvidFactory()
    expected_response = jsonable_encoder(fanvid)
    expected_response["audio"] = {
        "title": expected_response.pop("audio_title"),
        "artists_or_sources": expected_response.pop("audio_artists_or_sources"),
        "language": expected_response.pop("audio_language"),
    }
    expected_response['title'] = f"{expected_response['title']} and then some"
    response = fastapi_client.patch(
        f"/fanvids/{str(fanvid['uuid'])}",
        json={
            "title": expected_response['title'],
        },
    )
    assert response.status_code == 200
    response_data = response.json()
    assert response_data.pop('modified_timestamp') > expected_response.pop('modified_timestamp')
    assert response_data == expected_response


def test_update_fanvid__404(fastapi_client):
    response = fastapi_client.patch(
        "/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6",
        json={
            "title": "string",
        },
    )
    assert response.status_code == 404


def test_delete_fanvid(fastapi_client):
    response = fastapi_client.delete("/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6")
    assert response.status_code == 204
