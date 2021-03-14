def test_read_fanvids(fastapi_client):
    response = fastapi_client.get("/fanvids")
    assert response.status_code == 200
