from typing import Optional

from fastapi_users import models
from pydantic import validator
from zxcvbn import zxcvbn  # type: ignore


class User(models.BaseUser):
    username: Optional[str]


class UserCreate(models.BaseUserCreate):
    username: str

    @validator("password")
    def strong_password(cls, v):
        strength = zxcvbn(v)
        if strength["score"] < 4:
            errors = []
            feedback = strength["feedback"]
            if feedback["warning"]:
                errors.append(feedback["warning"])
            if feedback["suggestions"]:
                errors += feedback["suggestions"]
            raise ValueError(errors)
        return v


class UserUpdate(User, models.BaseUserUpdate):
    pass


class UserDB(User, models.BaseUserDB):
    username: str
