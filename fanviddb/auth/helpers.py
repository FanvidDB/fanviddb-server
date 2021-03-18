from fastapi_users import FastAPIUsers
from fastapi_users.authentication import CookieAuthentication

from fanviddb import conf

from .db import user_db
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

fastapi_users = FastAPIUsers(
    user_db,
    auth_backends,
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)
