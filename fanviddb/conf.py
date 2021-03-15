import databases
from starlette.config import Config

config = Config(".env")

TESTING = config("TESTING", cast=bool, default=False)

DATABASE_URL = config("DATABASE_URL", cast=databases.DatabaseURL)

if "@localhost/circle_test" in DATABASE_URL.database:
    TEST_DATABASE_URL = DATABASE_URL
else:
    TEST_DATABASE_URL = DATABASE_URL.replace(database="test_" + DATABASE_URL.database)
AUTH_SECRET_KEY = config("AUTH_SECRET_KEY")
EMAIL_TOKEN_SECRET_KEY = config("EMAIL_TOKEN_SECRET_KEY")
