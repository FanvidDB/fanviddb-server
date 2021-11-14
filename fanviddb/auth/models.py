from typing import Optional

from fastapi_users import models
from pydantic import validator


class User(models.BaseUser):
    username: Optional[str]


class UserCreate(models.BaseUserCreate):
    username: str


class UserUpdate(models.BaseUserUpdate):
    username: Optional[str]


class UserDB(User, models.BaseUserDB):
    username: str
