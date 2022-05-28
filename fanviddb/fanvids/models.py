from uuid import uuid4

from sqlalchemy import JSON
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Index
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy.dialects.postgresql import UUID

from fanviddb.db import Base

# For now, hard-code this. If we have some way of knowing per-fanvid what
# language to search in, we could be more granular.
FILENAME_SEARCH_LANGUAGE = "english"


class Fanvid(Base):

    __tablename__ = "fanvids"

    uuid: UUID = Column(UUID(as_uuid=True), default=uuid4, primary_key=True)
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
    filename_search_doc: str = Column(TSVECTOR(), nullable=False)

    __table_args__ = (
        Index("filename_search_index", "filename_search_doc", postgresql_using="gin"),
    )


fanvids = Fanvid.__table__
