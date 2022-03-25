from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Column
from sqlalchemy import String

from fanviddb.db import Base


class UserTable(Base, SQLAlchemyBaseUserTable):
    username = Column(String(length=40), nullable=False, unique=True)


users = UserTable.__table__  # type: ignore
