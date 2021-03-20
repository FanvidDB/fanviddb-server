import pytest
from asgi_lifespan import LifespanManager
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy_utils import create_database  # type: ignore
from sqlalchemy_utils import database_exists  # type: ignore
from sqlalchemy_utils import drop_database  # type: ignore
from starlette.config import environ

environ["TESTING"] = "1"

from fanviddb import conf  # noqa: E402
from fanviddb import db  # noqa: E402
from fanviddb.api import app as fanviddb_app  # noqa: E402

from .factories import UserFactory  # noqa: E402


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
async def app():
    async with LifespanManager(fanviddb_app):
        yield fanviddb_app


@pytest.fixture
async def fastapi_client(app):
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture
async def logged_in_client(app):
    async with AsyncClient(app=app, base_url="http://test") as client:
        password = "swordfish"
        user = await UserFactory(password=password)
        response = await client.post(
            "/auth/login",
            data={
                "username": user["username"],
                "password": password,
            },
        )
        assert response.status_code == 200
        # Disable security for the auth cookie for local testing.
        client.cookies.jar._cookies["test.local"]["/"]["fanviddbauth"].secure = False
        client.user = user
        yield client
