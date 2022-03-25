from typing import Optional
from typing import Union
from typing import cast

from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request
from fastapi import status
from fastapi_users import BaseUserManager
from fastapi_users import FastAPIUsers
from fastapi_users import InvalidPasswordException
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

from .models import UserTable
from .schema import User
from .schema import UserCreate
from .schema import UserDB
from .schema import UserUpdate

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


class UserManager(BaseUserManager[UserCreate, UserDB]):
    user_db_model = UserDB
    reset_password_token_secret = conf.EMAIL_TOKEN_SECRET_KEY
    reset_password_token_lifetime_seconds = 60 * 5
    verification_token_secret = conf.EMAIL_TOKEN_SECRET_KEY
    verification_token_lifetime_seconds = 60 * 5
    user_db: SQLAlchemyUserDatabase

    async def on_after_forgot_password(
        self, user: UserDB, token: str, request: Optional[Request] = None
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
        self, user: UserDB, request: Optional[Request] = None
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
        self, user: UserDB, token: str, request: Optional[Request] = None
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
        self, user: UserDB, request: Optional[Request] = None
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

    async def validate_password(self, password: str, user: Union[UserCreate, UserDB]):
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
        user: UserCreate,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> UserDB:
        user = cast(UserCreate, user)
        query = select([exists().where(UserTable.username == user.username)])
        result = await self.user_db.session.execute(query)
        row = result.first()
        if row and row._mapping.get("anon_1"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="REGISTER_USERNAME_ALREADY_EXISTS",
            )
        return await super().create(user, safe, request)


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(UserDB, session, UserTable)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers(
    get_user_manager=get_user_manager,
    auth_backends=[cookie_authentication],
    user_model=User,
    user_create_model=UserCreate,
    user_update_model=UserUpdate,
    user_db_model=UserDB,
)
