import asyncio

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy_utils import create_database  # type: ignore
from sqlalchemy_utils import database_exists  # type: ignore
from sqlalchemy_utils import drop_database  # type: ignore
from starlette.config import environ

environ["TESTING"] = "1"

from fanviddb import conf  # noqa: E402
from fanviddb import db  # noqa: E402
from fanviddb.api import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def create_test_database():
    url = str(conf.TEST_DATABASE_URL)
    engine = create_engine(url)
    assert not database_exists(url), "Test database already exists. Aborting tests."
    create_database(url)
    db.Base.metadata.create_all(engine)
    yield
    drop_database(url)


@pytest.fixture
def fastapi_client():
    with TestClient(app) as client:
        yield client


@pytest.fixture()
def event_loop(fastapi_client):
    yield asyncio.get_event_loop()
