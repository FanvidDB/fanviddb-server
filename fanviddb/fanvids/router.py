import datetime
import uuid
from typing import List

from fastapi import APIRouter
from sqlalchemy.sql import select

from fanviddb.db import database

from . import db
from .models import CreateOrUpdateFanvid
from .models import Fanvid

router = APIRouter()


@router.post("", response_model=Fanvid, status_code=201)
async def create_fanvid(fanvid: CreateOrUpdateFanvid):
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
    return {
        "uuid": fanvid_uuid,
        "title": "Title",
        "creators": ["Author"],
        "premiere_date": None,
        "premiere_event": None,
        "audio": None,
        "length": datetime.timedelta(1),
        "rating": "Gen",
        "fandoms": [],
        "summary": "Summary!",
        "content_notes": ["Graphic depictions of violence"],
        "urls": ["https://archiveofourown.org/works/29759784"],
        "unique_identifiers": [],
        "thumbnail_url": "https://i.vimeocdn.com/video/1072432518.jpg?mw=1280&mh=720&q=70",
        "state": "active",
        "created_timestamp": datetime.datetime.utcnow(),
        "modified_timestamp": datetime.datetime.utcnow(),
    }


@router.put("/{fanvid_uuid}", response_model=Fanvid)
async def update_fanvid(fanvid_uuid: uuid.UUID, fanvid: CreateOrUpdateFanvid):
    fanvid_dict = fanvid.dict()
    fanvid_dict.update(
        {
            "uuid": fanvid_uuid,
            "created_timestamp": datetime.datetime.utcnow(),
            "modified_timestamp": datetime.datetime.utcnow(),
        }
    )
    return fanvid_dict


@router.delete("/{fanvid_uuid}", status_code=204)
async def delete_fanvid(fanvid_uuid: uuid.UUID):
    return None
