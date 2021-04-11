from typing import cast

from fastapi import HTTPException
from fastapi import status
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import CookieAuthentication
from fastapi_users.models import BaseUserCreate
from fastapi_users.models import BaseUserDB
from fastapi_users.user import CreateUserProtocol
from sqlalchemy.sql import exists
from sqlalchemy.sql import select

from fanviddb import conf
from fanviddb.db import database

from .db import user_db
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


def get_create_user(
    old_create_user: CreateUserProtocol,
) -> CreateUserProtocol:
    async def create_user(
        user: BaseUserCreate,
        safe: bool = False,
        is_active: bool = None,
        is_verified: bool = None,
    ) -> BaseUserDB:
        user = cast(UserCreate, user)
        query = select([exists().where(users.c.username == user.username)])
        result = await database.fetch_one(query)
        if result and result.get("anon_1"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="REGISTER_USERNAME_ALREADY_EXISTS",
            )
        return await old_create_user(user, safe, is_active, is_verified)

    return create_user


class FanvidsUsers(FastAPIUsers):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.create_user = get_create_user(self.create_user)


fastapi_users = FanvidsUsers(
    user_db,
    auth_backends,
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)
