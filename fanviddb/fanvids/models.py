import datetime
import uuid
from enum import Enum
from typing import List
from typing import Optional

from pydantic import BaseModel
from pydantic import HttpUrl


class RatingEnum(str, Enum):
    gen = "gen"
    teen = "teen"
    mature = "mature"
    explicit = "explicit"


class ContentNotesEnum(str, Enum):
    graphic_violence = "graphic-violence"
    major_character_death = "major-character-death"
    no_warnings_apply = "no-warnings-apply"
    rape_or_non_con = "rape-or-non-con"
    underage = "underage"
    physical_triggers = "physical-triggers"
    animal_harm = "animal-harm"
    auditory_triggers = "auditory-triggers"
    blackface_or_brownface_or_redface = "blackface-or-brownface-or-redface"
    significant_blood_or_gore = "significant-blood-or-gore"
    depictions_of_police = "depictions-of-police"
    holocaust_or_nazi_imagery = "holocaust-or-nazi-imagery"
    incest = "incest"
    queerphobia = "queerphobia"
    racism = "racism"
    self_harm = "self-harm"
    suicide = "suicide"
    transphobia = "transphobia"


class Audio(BaseModel):
    title: str
    artists_or_sources: List[str] = []
    language: str


class BaseFanvid(BaseModel):
    title: Optional[str]
    creators: Optional[List[str]]
    premiere_date: Optional[datetime.date] = None
    premiere_event: Optional[str] = None
    audio: Optional[Audio] = None
    length: Optional[datetime.timedelta]
    rating: Optional[RatingEnum]
    fandoms: Optional[List[str]]
    summary: Optional[str]
    content_notes: Optional[List[ContentNotesEnum]]
    urls: Optional[List[HttpUrl]]
    unique_identifiers: Optional[List[str]]
    thumbnail_url: Optional[HttpUrl]

    # Admin-only
    state: Optional[str]


class CreateFanvid(BaseFanvid):
    title: str
    creators: List[str]
    premiere_date: Optional[datetime.date] = None
    premiere_event: Optional[str] = None
    audio: Optional[Audio] = None
    length: datetime.timedelta
    rating: RatingEnum
    fandoms: List[str] = []
    summary: str
    content_notes: List[ContentNotesEnum] = []
    urls: List[HttpUrl] = []
    unique_identifiers: List[str] = []
    thumbnail_url: HttpUrl


class UpdateFanvid(BaseFanvid):
    pass


class Fanvid(CreateFanvid):
    uuid: uuid.UUID
    created_timestamp: datetime.datetime
    modified_timestamp: datetime.datetime
