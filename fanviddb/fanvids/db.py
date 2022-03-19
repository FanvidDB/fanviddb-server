import datetime
import uuid
from pathlib import Path
from typing import Any
from typing import List
from typing import Mapping
from typing import Optional
from typing import Tuple

from sqlalchemy import JSON
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Index
from sqlalchemy import String
from sqlalchemy import desc
from sqlalchemy import func
from sqlalchemy import update
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import select
from sqlalchemy.sql.functions import Function

from fanviddb.db import Base
from fanviddb.db import database

from .constants import FILENAME_PUNCTUATION_RE
from .constants import VIDEO_EXTENSIONS
from .models import CreateFanvid
from .models import Fanvid
from .models import FanvidWithRelevance
from .models import StateEnum
from .models import UpdateFanvid

# For now, hard-code this. If we have some way of knowing per-fanvid what
# language to search in, we could be more granular.
FILENAME_SEARCH_LANGUAGE = "english"


class FanvidTable(Base):

    __tablename__ = "fanvids"

    uuid = Column(UUID(), default=uuid.uuid4, primary_key=True)
    title = Column(String(), nullable=False)
    creators = Column(JSON(), nullable=False)
    premiere_date = Column(DateTime())
    premiere_event = Column(String(), nullable=False)
    audio_title = Column(String(), nullable=False)
    audio_artists_or_sources = Column(JSON(), nullable=False)
    audio_languages = Column(JSON(), nullable=False)
    length = Column(INTERVAL(), nullable=False)
    rating = Column(String(), nullable=False)
    fandoms = Column(JSON(), nullable=False)
    summary = Column(String(), nullable=False)
    content_notes = Column(JSON(), nullable=False)
    urls = Column(JSON(), nullable=False)
    unique_identifiers = Column(JSON(), nullable=False)
    thumbnail_url = Column(String(), nullable=False)

    # Admin-only
    state = Column(String(), nullable=False)

    # Internal
    created_timestamp = Column(DateTime(), nullable=False)
    modified_timestamp = Column(DateTime(), nullable=False)
    filename_search_doc = Column(TSVECTOR(), nullable=False)

    __table_args__ = (
        Index("filename_search_index", "filename_search_doc", postgresql_using="gin"),
    )


fanvids = FanvidTable.__table__


def _to_db(fanvid: dict):
    audio = fanvid.pop("audio", None)
    if audio:
        fanvid.update(
            {
                "audio_title": audio["title"],
                "audio_artists_or_sources": audio["artists_or_sources"],
                "audio_languages": audio["languages"],
            }
        )
    return fanvid


def _to_api(fanvid: Mapping[str, Any]):
    fanvid = dict(fanvid)
    fanvid["audio"] = {
        "title": fanvid.pop("audio_title"),
        "artists_or_sources": fanvid.pop("audio_artists_or_sources"),
        "languages": fanvid.pop("audio_languages"),
    }
    del fanvid["filename_search_doc"]
    return fanvid


def _filename_search_doc(fanvid: Mapping[str, Any]):
    strings = (
        [fanvid["title"]]
        + fanvid["creators"]
        + fanvid["fandoms"]
        + [ui["identifier"] for ui in fanvid["unique_identifiers"]]
    )
    return func.to_tsvector(
        FILENAME_SEARCH_LANGUAGE,
        " || ' ' || ".join(strings),
    )


def filename_to_tsquery(filename: str) -> Function:
    # Remove video file suffixes
    path = Path(filename)
    while path.suffix in VIDEO_EXTENSIONS:
        path = path.with_suffix("")
    # For filename search, we don't allow a full websearch-style query language;
    # we just need to match as many of the present words as possible.
    query = FILENAME_PUNCTUATION_RE.sub(" ", str(path)).strip()
    query = " | ".join(query.split(" "))
    return func.to_tsquery(FILENAME_SEARCH_LANGUAGE, query)


async def create_fanvid(fanvid: CreateFanvid) -> Optional[Fanvid]:
    fanvid_dict = _to_db(fanvid.dict())
    fanvid_dict.update(
        {
            "uuid": uuid.uuid4(),
            "created_timestamp": datetime.datetime.utcnow(),
            "modified_timestamp": datetime.datetime.utcnow(),
            "state": StateEnum.active,
            "filename_search_doc": _filename_search_doc(fanvid_dict),
        }
    )
    query = fanvids.insert().values(**fanvid_dict).returning(fanvids)
    result = await database.fetch_one(query)
    if not result:
        return None

    return _to_api(result)


async def list_fanvids(
    offset: int, limit: int, filename: Optional[str] = None
) -> Tuple[int, List[FanvidWithRelevance]]:
    query = (
        select([fanvids])
        .where(fanvids.c.state != "deleted")
        .order_by(fanvids.c.created_timestamp.desc())
    )

    if filename:
        filename_tsquery = filename_to_tsquery(filename)
        query = query.add_columns(  # type: ignore
            func.ts_rank(fanvids.c.filename_search_doc, filename_tsquery).label(
                "relevance"
            )
        )
        query = query.where(fanvids.c.filename_search_doc.op("@@")(filename_tsquery))
        # Clear out existing sorts - only use relevance.
        query = query.order_by(None).order_by(desc("relevance"))

    page = query.limit(limit).offset(offset)

    fanvid_list = [_to_api(dict(row)) for row in await database.fetch_all(page)]
    total_count_result = await database.fetch_one(
        select([func.count()]).select_from(query.alias("fanvids"))
    )
    total_count = total_count_result["count_1"] if total_count_result else 0
    return total_count, fanvid_list


async def read_fanvid(fanvid_uuid: uuid.UUID) -> Optional[Fanvid]:
    query = select([fanvids]).where(fanvids.c.uuid == fanvid_uuid)
    result = await database.fetch_one(query)
    if not result:
        return None
    return _to_api(result)


async def update_fanvid(
    fanvid_uuid: uuid.UUID, fanvid: UpdateFanvid
) -> Optional[Fanvid]:
    fanvid_dict = _to_db(fanvid.dict(exclude_unset=True))
    fanvid_dict.update(
        {
            "modified_timestamp": datetime.datetime.utcnow(),
        }
    )
    query = (
        update(fanvids)
        .where(fanvids.c.uuid == fanvid_uuid)
        .values(fanvid_dict)
        .returning(fanvids)
    )
    result = await database.fetch_one(query)
    if not result:
        return None

    # If any of the filename_search_doc fields changed, update it
    if set(fanvid_dict) & set(("title", "creators", "fandoms", "unique_identifiers")):
        filename_search_doc = _filename_search_doc(dict(result))
        query = (
            update(fanvids)
            .where(fanvids.c.uuid == fanvid_uuid)
            .values(filename_search_doc=filename_search_doc)
        )
        await database.fetch_one(query)

    return _to_api(result)
