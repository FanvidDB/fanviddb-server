import datetime
import uuid
from typing import List
from typing import Optional

from pydantic import BaseModel


class Audio(BaseModel):
    title: str
    artists_or_sources: List[str] = []
    language: str


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


class CreateFanvid(BaseFanvid):
    pass


class UpdateFanvid(BaseModel):
    title: Optional[str]
    creators: Optional[List[str]]
    premiere_date: Optional[datetime.date] = None
    premiere_event: Optional[str] = None
    audio: Optional[Audio] = None
    length: Optional[datetime.timedelta]
    rating: Optional[str]
    fandoms: Optional[List[str]]
    summary: Optional[str]
    content_notes: Optional[List[str]]
    urls: Optional[List[str]]
    unique_identifiers: Optional[List[str]]
    thumbnail_url: Optional[str]

    # Admin-only
    state: Optional[str]


class Fanvid(BaseFanvid):
    uuid: uuid.UUID
    created_timestamp: datetime.datetime
    modified_timestamp: datetime.datetime
