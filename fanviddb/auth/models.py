from typing import Optional

from fastapi_users import models


class User(models.BaseUser):
    pass


class UserCreate(models.BaseUserCreate):
    username: str


class UserUpdate(User, models.BaseUserUpdate):
    username: Optional[str]


class UserDB(User, models.BaseUserDB):
    username: str
