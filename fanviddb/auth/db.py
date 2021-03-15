from fastapi_users.db import SQLAlchemyBaseUserTable
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import Column
from sqlalchemy import String

from fanviddb.db import Base
from fanviddb.db import database

from .models import UserDB


class UserTable(Base, SQLAlchemyBaseUserTable):
    username = Column(String(length=40), nullable=False)


users = UserTable.__table__
user_db = SQLAlchemyUserDatabase(UserDB, database, users)
