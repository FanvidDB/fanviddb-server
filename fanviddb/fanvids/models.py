import datetime
import uuid
from typing import List
from typing import Optional

from pydantic import BaseModel


class Audio(BaseModel):
    title: str
    creators: List[str]


class BaseFanvid(BaseModel):
    title: str
    creators: List[str]
    premiere_date: Optional[datetime.date] = None
    premiere_event: Optional[str] = None
    audio: Optional[Audio] = None
    length: datetime.timedelta
    rating: str
    fandoms: List[str] = []
    summary: str
    content_notes: List[str] = []
    urls: List[str] = []
    unique_identifiers: List[str] = []
    thumbnail_url: str

    # Admin-only
    state: str


class CreateOrUpdateFanvid(BaseFanvid):
    pass


class Fanvid(BaseFanvid):
    uuid: uuid.UUID
    created_timestamp: datetime.datetime
    modified_timestamp: datetime.datetime
