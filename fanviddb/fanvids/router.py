import uuid
from typing import Optional

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from fluent.runtime import FluentLocalization  # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.exceptions import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from fanviddb.api_keys.helpers import check_api_key_header
from fanviddb.auth.helpers import fastapi_users
from fanviddb.auth.schema import User
from fanviddb.db import get_async_session
from fanviddb.i18n.utils import fluent_dependency

from . import crud
from .schema import CreateFanvid
from .schema import Fanvid
from .schema import FanvidList
from .schema import UpdateFanvid

router = APIRouter()


@router.post("", response_model=Fanvid, status_code=201)
async def create_fanvid(
    fanvid: CreateFanvid,
    user: User = Depends(fastapi_users.current_user()),
    fluent: FluentLocalization = Depends(fluent_dependency),
    session: AsyncSession = Depends(get_async_session),
):
    result = await crud.create_fanvid(session, fanvid)
    if not result:
        raise HTTPException(
            status_code=500, detail=fluent.format_value("fanvid-create-error")
        )

    return result


@router.get("", response_model=FanvidList)
async def list_fanvids(
    api_key: str = Depends(check_api_key_header),
    user: User = Depends(fastapi_users.current_user(optional=True)),
    fluent: FluentLocalization = Depends(fluent_dependency),
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=0, le=50),
    filename: Optional[str] = None,
    session: AsyncSession = Depends(get_async_session),
):
    if user is None and not api_key:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail=fluent.format_value("fanvid-user-or-api-key-required"),
        )

    total_count, fanvids = await crud.list_fanvids(
        session=session,
        offset=offset,
        limit=limit,
        filename=filename,
    )

    return {"total_count": total_count, "fanvids": fanvids}


@router.get("/{fanvid_uuid}", response_model=Fanvid)
async def read_fanvid(
    fanvid_uuid: uuid.UUID,
    fluent: FluentLocalization = Depends(fluent_dependency),
    session: AsyncSession = Depends(get_async_session),
):
    result = await crud.read_fanvid(session, fanvid_uuid)
    if not result:
        raise HTTPException(
            status_code=404, detail=fluent.format_value("fanvid-not-found")
        )
    return result


@router.patch("/{fanvid_uuid}", response_model=Fanvid)
async def update_fanvid(
    fanvid_uuid: uuid.UUID,
    fanvid: UpdateFanvid,
    user: User = Depends(fastapi_users.current_user()),
    fluent: FluentLocalization = Depends(fluent_dependency),
    session: AsyncSession = Depends(get_async_session),
):
    result = await crud.update_fanvid(session, fanvid_uuid, fanvid)
    if not result:
        raise HTTPException(
            status_code=404, detail=fluent.format_value("fanvid-not-found")
        )
    return result
