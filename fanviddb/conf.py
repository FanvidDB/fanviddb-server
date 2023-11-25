import os

from sqlalchemy.engine.url import make_url
from starlette.config import Config

config = Config(".env")

TESTING = config("TESTING", cast=bool, default=False)

DATABASE_URL = config("DATABASE_URL")

# Shim for backwards-compat with older postgres:// DATABASE_URLs.
# https://stackoverflow.com/questions/66690321/flask-and-heroku-sqlalchemy-exc-nosuchmoduleerror-cant-load-plugin-sqlalchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres", "postgresql", 1)

# Shim for backwards-compat with non-async postgres DATABASE_URLs.
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql", "postgresql+asyncpg", 1)

_url = make_url(DATABASE_URL)
if _url.database is None:
    raise Exception("Url does not have a database.")
TEST_DATABASE_URL = str(_url.set(database="test_" + _url.database))

IS_CIRCLECI = os.getenv("IS_CIRCLECI") == "true"
AUTH_SECRET_KEY = config("AUTH_SECRET_KEY")
EMAIL_TOKEN_SECRET_KEY = config("EMAIL_TOKEN_SECRET_KEY")

DEFAULT_FROM_EMAIL = "noreply@fanviddb.com"
POSTMARK_API_KEY = config("POSTMARK_API_KEY", default=None)
