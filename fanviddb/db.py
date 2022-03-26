from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from . import conf

if conf.TESTING:
    # Previously this used force_rollback=True to rollback, which I
    # think was so that the tests would never commit anything? but maybe
    # it's not actually important.
    engine = create_async_engine(conf.TEST_DATABASE_URL)
else:
    engine = create_async_engine(conf.DATABASE_URL)

async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
