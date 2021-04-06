from fastapi import APIRouter
from fastapi import Request

from fanviddb import conf
from fanviddb.email import send_email
from fanviddb.i18n.utils import get_fluent
from fanviddb.i18n.utils import get_request_locales

from .helpers import cookie_authentication
from .helpers import fastapi_users
from .models import UserDB


def on_after_register(user: UserDB, request: Request):
    locales = get_request_locales(request)
    fluent = get_fluent(locales)
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=fluent.format_value("email-confirm-registration-subject"),
        content=fluent.format_value(
            "email-confirm-registration-content", {"username": user.username}
        ),
    )


def on_after_forgot_password(user: UserDB, token: str, request: Request):
    locales = get_request_locales(request)
    fluent = get_fluent(locales)
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=fluent.format_value("email-forgot-password-subject"),
        content=fluent.format_value("email-forgot-password-content", {"token": token}),
    )


def on_after_reset_password(user: UserDB, request: Request):
    locales = get_request_locales(request)
    fluent = get_fluent(locales)
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=fluent.format_value("email-after-reset-password-subject"),
        content=fluent.format_value(
            "email-after-reset-password-content", {"username": user.username}
        ),
    )


def on_after_verification_request(user: UserDB, token: str, request: Request):
    locales = get_request_locales(request)
    fluent = get_fluent(locales)
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=fluent.format_value("email-verification-subject"),
        content=fluent.format_value(
            "email-verification-content", {"username": user.username, "token": token}
        ),
    )


def on_after_verification(user: UserDB, request: Request):
    locales = get_request_locales(request)
    fluent = get_fluent(locales)
    send_email(
        from_email=conf.DEFAULT_FROM_EMAIL,
        to_emails=[user.email],
        subject=fluent.format_value("email-after-verification-subject"),
        content=fluent.format_value(
            "email-after-verification-content", {"username": user.username}
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

users_router = fastapi_users.get_users_router(
    requires_verification=True,
)
