from fastapi import APIRouter

from .helpers import generate
from .models import ApiKey

api_key_router = APIRouter()


@api_key_router.post("/", response_model=ApiKey)
async def create_api_key():
    api_key = await generate()
    return {"api_key": api_key}
