from fastapi import APIRouter

from .helpers import cookie_authentication
from .helpers import fastapi_users
from .schema import UserCreate
from .schema import UserRead
from .schema import UserUpdate

auth_router = APIRouter()
auth_router.include_router(
    fastapi_users.get_auth_router(cookie_authentication, requires_verification=True),
)
auth_router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)
auth_router.include_router(
    fastapi_users.get_reset_password_router(),
)
auth_router.include_router(
    fastapi_users.get_verify_router(UserRead),
)

users_router = fastapi_users.get_users_router(
    UserRead,
    UserUpdate,
    requires_verification=True,
)
