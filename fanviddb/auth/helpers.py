from typing import Optional
from typing import Union
from typing import cast

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request
from fastapi import status
from fastapi_users import BaseUserManager
from fastapi_users import FastAPIUsers
from fastapi_users import InvalidPasswordException
from fastapi_users.authentication import CookieAuthentication
from fastapi_users.models import BaseUserCreate
from fastapi_users.models import BaseUserDB
from sqlalchemy.sql import exists
from sqlalchemy.sql import select
from zxcvbn import zxcvbn  # type: ignore

from fanviddb import conf
from fanviddb.db import database
from fanviddb.email import send_email
from fanviddb.i18n.utils import get_fluent
from fanviddb.i18n.utils import get_request_locales

from .db import get_user_db
from .db import users
from .models import User
from .models import UserCreate
from .models import UserDB
from .models import UserUpdate

auth_backends = []

cookie_authentication = CookieAuthentication(
    secret=conf.AUTH_SECRET_KEY,
    lifetime_seconds=60 * 60 * 24 * 14,
    cookie_name="fanviddbauth",
)

auth_backends.append(cookie_authentication)


class UserManager(BaseUserManager[UserCreate, UserDB]):
    user_db_model = UserDB
    reset_password_token_secret = conf.EMAIL_TOKEN_SECRET_KEY
    reset_password_token_lifetime_seconds = 60 * 5
    verification_token_secret = conf.EMAIL_TOKEN_SECRET_KEY
    verification_token_lifetime_seconds = 60 * 5

    def on_after_forgot_password(
        user: UserDB, token: str, request: Optional[Request] = None
    ):
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

    def on_after_reset_password(user: UserDB, request: Optional[Request] = None):
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

    def on_after_request_verify(
        user: UserDB, token: str, request: Optional[Request] = None
    ):
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

    def on_after_verify(user: UserDB, request: Optional[Request] = None):
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
        user: BaseUserCreate,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> BaseUserDB:
        user = cast(UserCreate, user)
        query = select([exists().where(users.c.username == user.username)])
        result = await database.fetch_one(query)
        if result and result.get("anon_1"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="REGISTER_USERNAME_ALREADY_EXISTS",
            )
        return await super().create(user, safe, request)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers(
    get_user_manager,
    auth_backends,
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)
