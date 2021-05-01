import datetime
import uuid
from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from fluent.runtime import FluentLocalization  # type: ignore
from sqlalchemy import func
from sqlalchemy import update
from sqlalchemy.sql import select
from starlette.exceptions import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from fanviddb.api_keys.helpers import check_api_key_header
from fanviddb.auth.helpers import fastapi_users
from fanviddb.auth.models import User
from fanviddb.db import database
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
    fanvid_dict = fanvid.dict()
    audio = fanvid_dict.pop("audio")
    if audio:
        fanvid_dict.update(
            {
                "audio_title": audio["title"],
                "audio_artists_or_sources": audio["artists_or_sources"],
                "audio_language": audio["language"],
            }
        )
    fanvid_dict.update(
        {
            "uuid": uuid.uuid4(),
            "created_timestamp": datetime.datetime.utcnow(),
            "modified_timestamp": datetime.datetime.utcnow(),
        }
    )
    query = db.fanvids.insert().values(**fanvid_dict).returning(db.fanvids)
    result = await database.fetch_one(query)

    if not result:
        raise HTTPException(
            status_code=500, detail=fluent.format_value("fanvid-create-error")
        )

    result = dict(result)

    result["audio"] = {
        "title": result.pop("audio_title"),
        "artists_or_sources": result.pop("audio_artists_or_sources"),
        "language": result.pop("audio_language"),
    }
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
    base_query = select([db.fanvids]).where(db.fanvids.c.state != "deleted")
    paginated_query = base_query.order_by(db.fanvids.c.created_timestamp.desc()).limit(limit).offset(offset)
    fanvids = [dict(row) for row in await database.fetch_all(paginated_query)]
    total_count_result = await database.fetch_one(
        select([func.count()]).select_from(base_query.alias("fanvids"))
    )
    total_count = total_count_result["count_1"]
    for fanvid in fanvids:
        fanvid["audio"] = {
            "title": fanvid.pop("audio_title"),
            "artists_or_sources": fanvid.pop("audio_artists_or_sources"),
            "language": fanvid.pop("audio_language"),
        }

    return {"total_count": total_count, "fanvids": fanvids}


@router.get("/{fanvid_uuid}", response_model=Fanvid)
async def read_fanvid(
    fanvid_uuid: uuid.UUID,
    fluent: FluentLocalization = Depends(fluent_dependency),
):
    query = select([db.fanvids]).where(db.fanvids.c.uuid == fanvid_uuid)
    result = await database.fetch_one(query)

    if not result:
        raise HTTPException(
            status_code=404, detail=fluent.format_value("fanvid-not-found")
        )

    result = dict(result)

    result["audio"] = {
        "title": result.pop("audio_title"),
        "artists_or_sources": result.pop("audio_artists_or_sources"),
        "language": result.pop("audio_language"),
    }

    return result


@router.patch("/{fanvid_uuid}", response_model=Fanvid)
async def update_fanvid(
    fanvid_uuid: uuid.UUID,
    fanvid: UpdateFanvid,
    user: User = Depends(fastapi_users.current_user()),
    fluent: FluentLocalization = Depends(fluent_dependency),
):
    fanvid_dict = fanvid.dict(exclude_unset=True)
    audio = fanvid_dict.pop("audio", None)
    if audio:
        fanvid_dict.update(
            {
                "audio_title": audio["title"],
                "audio_artists_or_sources": audio["artists_or_sources"],
                "audio_language": audio["language"],
            }
        )
    fanvid_dict.update(
        {
            "modified_timestamp": datetime.datetime.utcnow(),
        }
    )
    query = (
        update(db.fanvids)
        .where(db.fanvids.c.uuid == fanvid_uuid)
        .values(fanvid_dict)
        .returning(db.fanvids)
    )
    result = await database.fetch_one(query)

    if not result:
        raise HTTPException(
            status_code=404, detail=fluent.format_value("fanvid-not-found")
        )

    result = dict(result)

    result["audio"] = {
        "title": result.pop("audio_title"),
        "artists_or_sources": result.pop("audio_artists_or_sources"),
        "language": result.pop("audio_language"),
    }
    return result
