from typing import Any
from typing import Dict

from fastapi import APIRouter
from fastapi import Request

from fanviddb import conf

from .helpers import cookie_authentication
from .helpers import fastapi_users
from .models import UserDB


def on_after_register(user: UserDB, _: Request):
    print(f"User {user.id} has registered.")


def on_after_forgot_password(user: UserDB, token: str, _: Request):
    print(f"User {user.id} has forgot their password. Reset token: {token}")


def on_after_reset_password(user: UserDB, _: Request):
    print(f"User {user.id} has reset their password.")


def on_after_verification_request(user: UserDB, token: str, _: Request):
    print(f"Verification requested for user {user.id}. Verification token: {token}")


def on_after_verification(user: UserDB, _: Request):
    print(f"User {user.id} has verified their email.")


auth_router = APIRouter()
auth_router.include_router(
    fastapi_users.get_auth_router(cookie_authentication, requires_verification=True),
)
auth_router.include_router(
    fastapi_users.get_register_router(on_after_register),
)
auth_router.include_router(
    fastapi_users.get_reset_password_router(
        reset_password_token_secret=conf.EMAIL_TOKEN_SECRET_KEY,
        reset_password_token_lifetime_seconds=60 * 5,
        after_forgot_password=on_after_forgot_password,
        after_reset_password=on_after_reset_password,
    ),
)
auth_router.include_router(
    fastapi_users.get_verify_router(
        verification_token_secret=conf.EMAIL_TOKEN_SECRET_KEY,
        verification_token_lifetime_seconds=60 * 5,
        after_verification_request=on_after_verification_request,
        after_verification=on_after_verification,
    ),
)


def on_after_update(user: UserDB, updated_user_data: Dict[str, Any], _: Request):
    print(
        f"User {user.id} has been updated with the following data: {updated_user_data}"
    )


users_router = fastapi_users.get_users_router(
    requires_verification=True,
    after_update=on_after_update,
)
