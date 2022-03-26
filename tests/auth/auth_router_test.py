import pytest
from fastapi.encoders import jsonable_encoder
from fastapi_users.jwt import generate_jwt
from passlib import pwd  # type: ignore
from sqlalchemy.sql import select

from fanviddb.auth.helpers import UserManager
from fanviddb.auth.models import users

from ..factories import UserFactory
from ..factories import password_helper


def generate_test_jwt(user, secret, audience):
    token_data = {
        "user_id": str(user["id"]),
        "email": user["email"],
        "aud": audience,
    }
    return generate_jwt(
        token_data,
        secret,
        lifetime_seconds=60,
    )


@pytest.mark.asyncio
async def test_register(db_session, fastapi_client):
    post_data = {
        "email": "hello@example.com",
        "username": "hello",
        "password": pwd.genword(entropy="secure", charset="ascii_50"),
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
    result = await db_session.execute(query)
    _rows = result.all()
    rows = [row._asdict() for row in _rows]
    assert len(rows) == 1
    user_data = jsonable_encoder(rows[0])
    hashed_password = user_data.pop("hashed_password", "!")
    assert user_data == expected_data
    password_helper.verify_and_update(post_data["password"], hashed_password)


@pytest.mark.asyncio
async def test_register__duplicate_email(db_session, fastapi_client):
    await UserFactory(
        db_session=db_session,
        username="whatever",
        email="wwx@fanviddb.com",
    )
    post_data = {
        "email": "wwx@fanviddb.com",
        "username": "suibian",
        "password": pwd.genword(entropy="secure", charset="ascii_50"),
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
async def test_register__duplicate_username(db_session, fastapi_client):
    await UserFactory(
        db_session=db_session,
        username="wwx",
        email="whatever@fanviddb.com",
    )
    post_data = {
        "email": "suibian@fanviddb.com",
        "username": "wwx",
        "password": pwd.genword(entropy="secure", charset="ascii_50"),
    }
    response = await fastapi_client.post(
        "/api/auth/register",
        json=post_data,
    )
    assert response.status_code == 400, response.json()
    response_data = response.json()
    expected_data = {"detail": "REGISTER_USERNAME_ALREADY_EXISTS"}
    assert response_data == expected_data


@pytest.mark.asyncio
async def test_register__weak_password(fastapi_client):
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
    assert response_data.get("detail") is not None
    assert response_data["detail"].get("reason") is not None


@pytest.mark.asyncio
async def test_request_verify__sends_email_to_user(db_session, fastapi_client, mocker):
    mocked_send_email = mocker.patch("fanviddb.auth.helpers.send_email")
    user = await UserFactory(db_session=db_session, is_verified=False)
    response = await fastapi_client.post(
        "/api/auth/request-verify-token",
        json={"email": user["email"]},
    )
    assert response.status_code == 202, response.json()
    response_data = response.json()
    assert response_data is None
    assert mocked_send_email.call_count == 1
    assert mocked_send_email.call_args[1]["to_emails"] == [user["email"]]


@pytest.mark.asyncio
async def test_verify__invalid_token(fastapi_client, mocker):
    mocked_send_email = mocker.patch("fanviddb.auth.helpers.send_email")
    response = await fastapi_client.post(
        "/api/auth/verify", json={"token": "awkelrjasd"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "VERIFY_USER_BAD_TOKEN"}
    assert mocked_send_email.call_count == 0


@pytest.mark.asyncio
async def test_verify__sends_email_to_user(db_session, fastapi_client, mocker):
    mocked_send_email = mocker.patch("fanviddb.auth.helpers.send_email")
    user = await UserFactory(db_session=db_session, is_verified=False)
    response = await fastapi_client.post(
        "/api/auth/verify",
        json={
            "token": generate_test_jwt(
                user,
                secret=UserManager.verification_token_secret,
                audience=UserManager.verification_token_audience,
            )
        },
    )
    assert response.status_code == 200
    assert response.json()["email"] == user["email"]
    assert mocked_send_email.call_count == 1
    assert mocked_send_email.call_args[1]["to_emails"] == [user["email"]]


@pytest.mark.asyncio
async def test_forgot_password__sends_email_to_user(db_session, fastapi_client, mocker):
    mocked_send_email = mocker.patch("fanviddb.auth.helpers.send_email")
    user = await UserFactory(db_session=db_session, is_verified=True)
    response = await fastapi_client.post(
        "/api/auth/forgot-password", json={"email": user["email"]}
    )
    assert response.status_code == 202
    assert response.json() is None
    assert mocked_send_email.call_count == 1
    assert mocked_send_email.call_args[1]["to_emails"] == [user["email"]]


@pytest.mark.asyncio
async def test_reset_password__sends_email_to_user(db_session, fastapi_client, mocker):
    mocked_send_email = mocker.patch("fanviddb.auth.helpers.send_email")
    user = await UserFactory(db_session=db_session, is_verified=True)
    response = await fastapi_client.post(
        "/api/auth/reset-password",
        json={
            "token": generate_test_jwt(
                user,
                secret=UserManager.reset_password_token_secret,
                audience=UserManager.reset_password_token_audience,
            ),
            "password": "TEST-asdfjkraew;lkrjv;oiuoi234q09q3pof;alkdm.x@#>{S",
        },
    )
    assert response.status_code == 200, response.json()
    assert response.json() is None
    assert mocked_send_email.call_count == 1
    assert mocked_send_email.call_args[1]["to_emails"] == [user["email"]]
