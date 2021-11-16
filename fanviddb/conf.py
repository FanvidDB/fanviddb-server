import databases
from starlette.config import Config

config = Config(".env")

TESTING = config("TESTING", cast=bool, default=False)

DATABASE_URL = config("DATABASE_URL", cast=databases.DatabaseURL)

# Shim for backwards-compat with older postgres:// DATABASE_URLs.
# https://stackoverflow.com/questions/66690321/flask-and-heroku-sqlalchemy-exc-nosuchmoduleerror-cant-load-plugin-sqlalchemy
if DATABASE_URL.scheme == "postgres":
    DATABASE_URL = DATABASE_URL.replace(scheme="postgresql")

if "@localhost/circle_test" in DATABASE_URL.database:
    TEST_DATABASE_URL = DATABASE_URL
else:
    TEST_DATABASE_URL = DATABASE_URL.replace(database="test_" + DATABASE_URL.database)
AUTH_SECRET_KEY = config("AUTH_SECRET_KEY")
EMAIL_TOKEN_SECRET_KEY = config("EMAIL_TOKEN_SECRET_KEY")

DEFAULT_FROM_EMAIL = "noreply@fanviddb.com"
SENDGRID_API_KEY = config("SENDGRID_API_KEY", default=None)
