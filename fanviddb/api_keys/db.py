from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import String

from fanviddb.db import Base


class ApiKeyTable(Base):

    __tablename__ = "api_keys"

    # pk functions as a public "username" so that we can find the
    # correct hashed secret to check.
    pk = Column(String(), primary_key=True)
    hashed_api_key = Column(String(), nullable=False)

    # Admin-only
    state = Column(String())

    # Internal
    created_timestamp = Column(DateTime())


api_keys = ApiKeyTable.__table__
