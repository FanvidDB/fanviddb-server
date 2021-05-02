import uuid

from sqlalchemy import JSON
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import INTERVAL
from sqlalchemy.dialects.postgresql import UUID

from fanviddb.db import Base


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


fanvids = FanvidTable.__table__
