import databases
import sqlalchemy
from fastapi import FastAPI
from fastapi_users import models
from fastapi_users.db import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from fanviddb.db import Base, database
from .models import User


class UserDB(User, models.BaseUserDB):
	pass


class UserTable(Base, SQLAlchemyBaseUserTable):
    pass


users = UserTable.__table__
user_db = SQLAlchemyUserDatabase(UserDB, database, users)
