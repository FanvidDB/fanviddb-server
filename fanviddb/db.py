import databases
import sqlalchemy
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from . import conf


database = databases.Database(conf.DATABASE_URL)
Base: DeclarativeMeta = declarative_base()
