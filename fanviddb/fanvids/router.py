import uuid

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from fluent.runtime import FluentLocalization  # type: ignore
from starlette.exceptions import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from fanviddb.api_keys.helpers import check_api_key_header
from fanviddb.auth.helpers import fastapi_users
from fanviddb.auth.models import User
from fanviddb.i18n.utils import fluent_dependency

from . import db
from .models import CreateFanvid
from .models import Fanvid
from .models import FanvidList
from .models import UpdateFanvid

router = APIRouter()


@router.post("", response_model=Fanvid, status_code=201)
async def create_fanvid(
    fanvid: CreateFanvid,
    user: User = Depends(fastapi_users.current_user()),
    fluent: FluentLocalization = Depends(fluent_dependency),
):
    result = await db.create_fanvid(fanvid)
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
):
    if user is None and not api_key:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail=fluent.format_value("fanvid-user-or-api-key-required"),
        )

    total_count, fanvids = await db.list_fanvids(
        offset=offset,
        limit=limit,
    )

    return {"total_count": total_count, "fanvids": fanvids}


@router.get("/{fanvid_uuid}", response_model=Fanvid)
async def read_fanvid(
    fanvid_uuid: uuid.UUID,
    fluent: FluentLocalization = Depends(fluent_dependency),
):
    result = await db.read_fanvid(fanvid_uuid)
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
):
    result = await db.update_fanvid(fanvid_uuid, fanvid)
    if not result:
        raise HTTPException(
            status_code=404, detail=fluent.format_value("fanvid-not-found")
        )
    return result
