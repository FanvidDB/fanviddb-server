import datetime
import uuid
from pathlib import Path
from typing import Any
from typing import Dict
from typing import List
from typing import Mapping
from typing import Optional
from typing import Tuple

from sqlalchemy import desc
from sqlalchemy import func
from sqlalchemy import type_coerce
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select
from sqlalchemy.sql.functions import Function
from sqlalchemy.types import UserDefinedType

from .constants import FILENAME_PUNCTUATION_RE
from .constants import VIDEO_EXTENSIONS
from .models import fanvids
from .schema import CreateFanvid
from .schema import Fanvid
from .schema import FanvidWithRelevance
from .schema import StateEnum
from .schema import UpdateFanvid

# For now, hard-code this. If we have some way of knowing per-fanvid what
# language to search in, we could be more granular.
FILENAME_SEARCH_LANGUAGE = "english"


# Workaround required for async sqlalchemy tsvector
# https://github.com/sqlalchemy/sqlalchemy/issues/6833#issuecomment-892844560
class REGCONFIG(UserDefinedType):
    cache_ok = True

    def get_col_spec(self, **_):
        return "regconfig"


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


def _to_api(fanvid: Dict[str, Any]):
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
        type_coerce(FILENAME_SEARCH_LANGUAGE, REGCONFIG),  # type: ignore
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
    return func.to_tsquery(
        type_coerce(FILENAME_SEARCH_LANGUAGE, REGCONFIG), query  # type: ignore
    )


async def create_fanvid(
    session: AsyncSession, fanvid: CreateFanvid
) -> Optional[Fanvid]:
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
    result = await session.execute(query)
    await session.commit()
    row = result.first()
    if not row:
        return None

    return _to_api(row._asdict())


async def list_fanvids(
    session: AsyncSession, offset: int, limit: int, filename: Optional[str] = None
) -> Tuple[int, List[FanvidWithRelevance]]:
    query = (
        select([fanvids])
        .where(fanvids.c.state != "deleted")
        .order_by(fanvids.c.created_timestamp.desc())
    )

    if filename:
        filename_tsquery = filename_to_tsquery(filename)
        query = query.add_columns(  # type: ignore
            func.ts_rank(fanvids.c.filename_search_doc, filename_tsquery, 32).label(
                "relevance"
            )
        )
        query = query.where(fanvids.c.filename_search_doc.op("@@")(filename_tsquery))
        # Clear out existing sorts - only use relevance.
        query = query.order_by(None).order_by(desc("relevance"))

    page = query.limit(limit).offset(offset)

    result = await session.execute(page)
    fanvid_list = [_to_api(row._asdict()) for row in result.all()]
    total_count_result = await session.execute(
        select([func.count()]).select_from(query.alias("fanvids"))
    )
    total_count_row = total_count_result.first()
    total_count = total_count_row.count_1 if total_count_row else 0
    return total_count, fanvid_list


async def read_fanvid(
    session: AsyncSession, fanvid_uuid: uuid.UUID
) -> Optional[Fanvid]:
    query = select([fanvids]).where(fanvids.c.uuid == fanvid_uuid)
    result = await session.execute(query)
    row = result.first()
    if not row:
        return None
    return _to_api(row._asdict())


async def update_fanvid(
    session: AsyncSession, fanvid_uuid: uuid.UUID, fanvid: UpdateFanvid
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
    result = await session.execute(query)
    await session.commit()
    row = result.first()
    if not row:
        return None

    # If any of the filename_search_doc fields changed, update it
    if set(fanvid_dict) & set(("title", "creators", "fandoms", "unique_identifiers")):
        filename_search_doc = _filename_search_doc(row._asdict())
        query = (
            update(fanvids)
            .where(fanvids.c.uuid == fanvid_uuid)
            .values(filename_search_doc=filename_search_doc)
        )
        await session.execute(query)
        await session.commit()

    return _to_api(row._asdict())
