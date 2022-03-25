from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from fanviddb.db import get_async_session

from .helpers import generate
from .schema import ApiKey

api_key_router = APIRouter()


@api_key_router.post("", response_model=ApiKey)
async def create_api_key(session: AsyncSession = Depends(get_async_session)):
    api_key = await generate(session)
    return {"api_key": api_key}
