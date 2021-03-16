import datetime
import uuid
from typing import List

from fastapi import APIRouter
from fastapi import HTTPException
from sqlalchemy import update
from sqlalchemy.sql import select

from fanviddb.db import database

from . import db
from .models import CreateFanvid
from .models import Fanvid
from .models import UpdateFanvid

router = APIRouter()


@router.post("", response_model=Fanvid, status_code=201)
async def create_fanvid(fanvid: CreateFanvid):
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
    query = db.fanvids.insert().values(**fanvid_dict)
    await database.execute(query)
    return fanvid_dict


@router.get("", response_model=List[Fanvid])
async def list_fanvids():
    query = select([db.fanvids]).order_by(db.fanvids.c.created_timestamp.desc())
    results = [dict(row) for row in await database.fetch_all(query)]

    for result in results:
        result["audio"] = {
            "title": result.pop("audio_title"),
            "artists_or_sources": result.pop("audio_artists_or_sources"),
            "language": result.pop("audio_language"),
        }

    return results


@router.get("/{fanvid_uuid}", response_model=Fanvid)
async def read_fanvid(fanvid_uuid: uuid.UUID):
    query = select([db.fanvids]).where(db.fanvids.c.uuid == fanvid_uuid)
    result = await database.fetch_one(query)

    if not result:
        raise HTTPException(status_code=404, detail="Fanvid not found")

    result = dict(result)

    result["audio"] = {
        "title": result.pop("audio_title"),
        "artists_or_sources": result.pop("audio_artists_or_sources"),
        "language": result.pop("audio_language"),
    }

    return result


@router.patch("/{fanvid_uuid}", response_model=Fanvid)
async def update_fanvid(fanvid_uuid: uuid.UUID, fanvid: UpdateFanvid):
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
            "modified_timestamp": datetime.datetime.utcnow(),
        }
    )
    query = (
        update(db.fanvids)
        .where(db.fanvids.c.uuid == fanvid_uuid)
        .values(**{k: v for k, v in fanvid_dict.items() if v})
        .returning(db.fanvids)
    )
    result = await database.fetch_one(query)

    if not result:
        raise HTTPException(status_code=404, detail="Fanvid not found")

    result = dict(result)

    result["audio"] = {
        "title": result.pop("audio_title"),
        "artists_or_sources": result.pop("audio_artists_or_sources"),
        "language": result.pop("audio_language"),
    }
    return result


@router.delete("/{fanvid_uuid}", status_code=204)
async def delete_fanvid(fanvid_uuid: uuid.UUID):
    return None
