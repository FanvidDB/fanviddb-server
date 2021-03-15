import databases
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.ext.declarative import declarative_base

from . import conf

if conf.TESTING:
    database = databases.Database(conf.TEST_DATABASE_URL, force_rollback=True)
else:
    database = databases.Database(conf.DATABASE_URL)
Base: DeclarativeMeta = declarative_base()
