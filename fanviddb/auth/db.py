from typing import Optional

from fastapi_users.db import SQLAlchemyBaseUserTable
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users.models import UD
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import func

from fanviddb.db import Base
from fanviddb.db import database

from .models import UserDB


class UserTable(Base, SQLAlchemyBaseUserTable):
    username = Column(String(length=40), nullable=False)


users = UserTable.__table__


class UserDatabase(SQLAlchemyUserDatabase[UD]):
    # fastapi_users hardcodes "email" but we actually use username.
    async def get_by_email(self, email: str) -> Optional[UD]:
        query = self.users.select().where(
            func.lower(self.users.c.username) == func.lower(email)
        )
        user = await self.database.fetch_one(query)
        return await self._make_user(user) if user else None


user_db = UserDatabase(UserDB, database, users)
