import pytest
from fastapi.encoders import jsonable_encoder
from fastapi_users.password import pwd_context
from sqlalchemy.sql import select

from fanviddb.auth.db import users
from fanviddb.db import database

from ..factories import UserFactory


@pytest.mark.asyncio
async def test_register(fastapi_client):
    post_data = {
        "email": "hello@example.com",
        "username": "hello",
        "password": "swordfish",
    }
    response = await fastapi_client.post(
        "/api/auth/register",
        json=post_data,
    )
    assert response.status_code == 201, response.json()
    response_data = response.json()
    expected_data = {
        **post_data,
        "id": response_data["id"],
        "is_active": True,
        "is_superuser": False,
        "is_verified": False,
    }
    del expected_data["password"]

    assert response_data == expected_data
    query = select([users])
    result = [dict(row) for row in await database.fetch_all(query)]
    assert len(result) == 1
    user_data = jsonable_encoder(result[0])
    hashed_password = user_data.pop("hashed_password", "!")
    assert user_data == expected_data
    pwd_context.verify(post_data["password"], hashed_password)


@pytest.mark.asyncio
async def test_register__duplicate_email(fastapi_client):
    await UserFactory(
        username="whatever",
        email="wwx@fanviddb.com",
    )
    post_data = {
        "email": "wwx@fanviddb.com",
        "username": "suibian",
        "password": "swordfish",
    }
    response = await fastapi_client.post(
        "/api/auth/register",
        json=post_data,
    )
    assert response.status_code == 400, response.json()
    response_data = response.json()
    expected_data = {"detail": "REGISTER_USER_ALREADY_EXISTS"}
    assert response_data == expected_data


@pytest.mark.asyncio
async def test_register__duplicate_username(fastapi_client):
    await UserFactory(
        username="wwx",
        email="whatever@fanviddb.com",
    )
    post_data = {
        "email": "suibian@fanviddb.com",
        "username": "wwx",
        "password": "swordfish",
    }
    response = await fastapi_client.post(
        "/api/auth/register",
        json=post_data,
    )
    assert response.status_code == 400, response.json()
    response_data = response.json()
    expected_data = {"detail": "REGISTER_USERNAME_ALREADY_EXISTS"}
    assert response_data == expected_data
