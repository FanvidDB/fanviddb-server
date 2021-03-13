import databases
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.ext.declarative import declarative_base

from . import conf

database = databases.Database(conf.DATABASE_URL)
Base: DeclarativeMeta = declarative_base()
