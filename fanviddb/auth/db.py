from fastapi_users.db import SQLAlchemyBaseUserTable
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import Column
from sqlalchemy import String

from fanviddb.db import Base
from fanviddb.db import database

from .models import UserDB


class UserTable(Base, SQLAlchemyBaseUserTable):
    username = Column(String(length=40), nullable=False, unique=True)


users = UserTable.__table__


async def get_user_db():
    yield SQLAlchemyUserDatabase(UserDB, database, users)
