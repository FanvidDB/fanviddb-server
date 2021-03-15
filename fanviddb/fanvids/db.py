import uuid

from sqlalchemy import JSON
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Interval
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID

from fanviddb.db import Base


class FanvidTable(Base):

    __tablename__ = "fanvids"

    uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    title = Column(String())
    creators = Column(JSON())
    premiere_date = Column(DateTime(), nullable=True)
    premiere_event = Column(String())
    audio_title = Column(String())
    audio_artists_or_sources = Column(String())
    audio_language = Column(String())
    length = Column(Interval())
    rating = Column(String())
    fandoms = Column(String())
    summary = Column(String())
    content_notes = Column(String())
    urls = Column(String())
    unique_identifiers = Column(String())
    thumbnail_url = Column(String())

    # Admin-only
    state = Column(String())

    # Internal
    created_timestamp = Column(DateTime())
    modified_timestamp = Column(DateTime())


fanvids = FanvidTable.__table__
