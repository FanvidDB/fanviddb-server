from sqlalchemy import func
from sqlalchemy.sql import select

from fanviddb.db import database
from fanviddb.fanvids.db import fanvids


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
    s = select([func.count()]).select_from(fanvids)
    count = event_loop.run_until_complete(database.execute(s))
    assert count == 1


def test_read_fanvids(fastapi_client):
    response = fastapi_client.get("/fanvids")
    assert response.status_code == 200


def test_read_fanvid(fastapi_client):
    response = fastapi_client.get("/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6")
    assert response.status_code == 200


def test_update_fanvid(fastapi_client):
    response = fastapi_client.put(
        "/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6",
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
    assert response.status_code == 200


def test_delete_fanvid(fastapi_client):
    response = fastapi_client.delete("/fanvids/3fa85f64-5717-4562-b3fc-2c963f66afa6")
    assert response.status_code == 204
