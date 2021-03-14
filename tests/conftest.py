import pytest
from fastapi.testclient import TestClient

from fanviddb.api import app


@pytest.fixture
def fastapi_client():
    return TestClient(app)
