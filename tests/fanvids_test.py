def test_create_fanvid(fastapi_client):
    response = fastapi_client.post(
        "/fanvids",
        json={
            "title": "string",
            "creators": ["string"],
            "premiere_date": "2021-03-14",
            "premiere_event": "string",
            "audio": {
                "title": "string",
                "creators": [
                    "string",
                ],
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


def test_read_fanvids(fastapi_client):
    response = fastapi_client.get("/fanvids")
    assert response.status_code == 200
