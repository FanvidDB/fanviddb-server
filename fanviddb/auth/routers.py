from fastapi import APIRouter

from .helpers import cookie_authentication
from .helpers import fastapi_users

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
