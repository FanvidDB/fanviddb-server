import os

from dotenv import load_dotenv

load_dotenv()


AUTH_SECRET_KEY = os.environ["AUTH_SECRET_KEY"]
DATABASE_URL = os.environ["DATABASE_URL"]
EMAIL_TOKEN_SECRET_KEY = os.environ["EMAIL_TOKEN_SECRET_KEY"]
