from typing import Optional
from typing import Union

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Request
from fastapi_users import BaseUserManager
from zxcvbn import zxcvbn  # type: ignore

from fanviddb import conf
from fanviddb.email import send_email
from fanviddb.i18n.utils import get_fluent
from fanviddb.i18n.utils import get_request_locales

from .db import get_user_db
from .helpers import cookie_authentication
from .helpers import fastapi_users
from .models import UserCreate
from .models import UserDB

auth_router = APIRouter()
auth_router.include_router(
    fastapi_users.get_auth_router(cookie_authentication, requires_verification=True),
)
auth_router.include_router(
    fastapi_users.get_register_router(),
)
auth_router.include_router(
    fastapi_users.get_reset_password_router(),
)
auth_router.include_router(
    fastapi_users.get_verify_router(),
)

users_router = fastapi_users.get_users_router(
    requires_verification=True,
)
