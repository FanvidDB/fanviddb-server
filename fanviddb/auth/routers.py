from gettext import gettext as _
from typing import Any
from typing import Dict

from fastapi import APIRouter
from fastapi import Request

from fanviddb import conf
from fanviddb.email import send_email

from .helpers import cookie_authentication
from .helpers import fastapi_users
from .models import UserDB


def on_after_register(user: UserDB, __: Request):
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=_("Registration confirmed"),
        content=_("You've registered, {username}!").format(username=user.username),
    )


def on_after_forgot_password(user: UserDB, token: str, __: Request):
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=_("Reset password request"),
        content=_("You requested a password reset. Reset token: {token}").format(
            token=token
        ),
    )


def on_after_reset_password(user: UserDB, __: Request):
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=_("Password reset complete"),
        content=_("Password reset for {username} complete.").format(
            username=user.username
        ),
    )


def on_after_verification_request(user: UserDB, token: str, __: Request):
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=_("Please verify your account"),
        content=_(
            "Verification requested for {username}. Verification token: {token}"
        ).format(username=user.username, token=token),
    )


def on_after_verification(user: UserDB, __: Request):
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=_("Account verified"),
        content=_("User {username} has verified their email.").format(
            username=user.username
        ),
    )


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


def on_after_update(user: UserDB, updated_user_data: Dict[str, Any], __: Request):
    print(
        _(
            "User {user_id} has been updated with the following data: {updated_user_data}"
        ).format(user_id=user.id, updated_user_data=updated_user_data)
    )


users_router = fastapi_users.get_users_router(
    requires_verification=True,
    after_update=on_after_update,
)
