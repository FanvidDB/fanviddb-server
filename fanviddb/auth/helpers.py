import uuid
from typing import Optional
from typing import Union

from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request
from fastapi import status
from fastapi_users import BaseUserManager
from fastapi_users import FastAPIUsers
from fastapi_users import InvalidPasswordException
from fastapi_users import UUIDIDMixin
from fastapi_users import models as fastapi_users_models
from fastapi_users import schemas as fastapi_users_schemas
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication import CookieTransport
from fastapi_users.authentication import JWTStrategy
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import exists
from sqlalchemy.sql import select
from zxcvbn import zxcvbn  # type: ignore

from fanviddb import conf
from fanviddb.db import get_async_session
from fanviddb.email import send_email
from fanviddb.i18n.utils import get_fluent
from fanviddb.i18n.utils import get_request_locales

from .models import User

AUTH_LIFETIME = 60 * 60 * 24 * 14
cookie_transport = CookieTransport(
    cookie_max_age=AUTH_LIFETIME,
    cookie_name="fanviddbauth",
)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=conf.AUTH_SECRET_KEY, lifetime_seconds=AUTH_LIFETIME)


cookie_authentication = AuthenticationBackend(
    name="cookie",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = conf.EMAIL_TOKEN_SECRET_KEY
    reset_password_token_lifetime_seconds = 60 * 5
    verification_token_secret = conf.EMAIL_TOKEN_SECRET_KEY
    verification_token_lifetime_seconds = 60 * 5
    user_db: SQLAlchemyUserDatabase

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        locales = get_request_locales(request)
        fluent = get_fluent(locales)
        send_email(
            from_email=conf.DEFAULT_FROM_EMAIL,
            to_emails=[user.email],
            subject=fluent.format_value("email-forgot-password-subject"),
            content=fluent.format_value(
                "email-forgot-password-content", {"token": token}
            ),
        )

    async def on_after_reset_password(
        self, user: User, request: Optional[Request] = None
    ) -> None:
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

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        locales = get_request_locales(request)
        fluent = get_fluent(locales)
        send_email(
            from_email=conf.DEFAULT_FROM_EMAIL,
            to_emails=[user.email],
            subject=fluent.format_value("email-verification-subject"),
            content=fluent.format_value(
                "email-verification-content",
                {"username": user.username, "token": token},
            ),
        )

    async def on_after_verify(
        self, user: User, request: Optional[Request] = None
    ) -> None:
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

    async def validate_password(
        self,
        password: str,
        user: Union[fastapi_users_schemas.UC, fastapi_users_models.UP],
    ):
        strength = zxcvbn(password)
        if strength["score"] < 4:
            errors = []
            feedback = strength["feedback"]
            if feedback["warning"]:
                errors.append(feedback["warning"])
            if feedback["suggestions"]:
                errors += feedback["suggestions"]
            raise InvalidPasswordException(errors)
        return None

    async def create(
        self,
        user: fastapi_users_schemas.UC,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> User:
        # `user` is actually going to be a UserCreate, which
        # has a username attribute. This workaround avoids
        # mypy complaining about type errors.
        username = getattr(user, "username", None)
        assert username is not None
        query = select([exists().where(User.username == username)])
        result = await self.user_db.session.execute(query)
        row = result.first()
        if row and row._mapping.get("anon_1"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="REGISTER_USERNAME_ALREADY_EXISTS",
            )
        return await super().create(user, safe, request)


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager=get_user_manager,
    auth_backends=[cookie_authentication],
)
