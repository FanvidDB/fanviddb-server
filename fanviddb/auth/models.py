from fastapi_users import models


class User(models.BaseUser):
	username: str


class UserCreate(models.BaseUser):
	username: str


class UserUpdate(User, models.BaseUserUpdate):
	pass
