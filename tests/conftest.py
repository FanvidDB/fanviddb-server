import asyncio
from typing import AsyncGenerator

import pytest
import pytest_asyncio  # type: ignore
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.config import environ

environ["TESTING"] = "1"

from fanviddb import conf  # noqa: E402
from fanviddb.app import api_app  # noqa: E402
from fanviddb.app import main_app  # noqa: E402
from fanviddb.db import Base  # noqa: E402
from fanviddb.db import get_async_session  # noqa: E402

from .factories import UserFactory  # noqa: E402


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def _database_url():
    return conf.TEST_DATABASE_URL


@pytest.fixture(scope="session")
def init_database():
    return Base.metadata.create_all


@pytest_asyncio.fixture
async def fastapi_client(db_session):
    async def _get_async_session() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    api_app.dependency_overrides[get_async_session] = _get_async_session
    async with AsyncClient(app=main_app, base_url="http://test") as client:
        yield client
    del api_app.dependency_overrides[get_async_session]


@pytest_asyncio.fixture
async def logged_in_client(fastapi_client, db_session):
    password = "swordfish"
    user = await UserFactory(db_session=db_session, password=password)
    response = await fastapi_client.post(
        "/api/auth/login",
        data={
            "username": user["email"],
            "password": password,
        },
    )
    assert response.status_code == 200
    # Disable security for the auth cookie for local testing.
    fastapi_client.cookies.jar._cookies["test.local"]["/"][
        "fanviddbauth"
    ].secure = False
    fastapi_client.user = user
    yield fastapi_client
