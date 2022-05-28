from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column
from sqlalchemy import String

from fanviddb.db import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    username = Column(String(length=40), nullable=False, unique=True)


users = User.__table__  # type: ignore
