import databases
from starlette.config import Config

config = Config(".env")

TESTING = config("TESTING", cast=bool, default=False)

DATABASE_URL = config("DATABASE_URL", cast=databases.DatabaseURL)
TEST_DATABASE_URL = config(
    "TEST_DATABASE_URL",
    cast=databases.DatabaseURL,
    default=DATABASE_URL.replace(database="test_" + DATABASE_URL.database),
)
AUTH_SECRET_KEY = config("AUTH_SECRET_KEY")
EMAIL_TOKEN_SECRET_KEY = config("EMAIL_TOKEN_SECRET_KEY")
