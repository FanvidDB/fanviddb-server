import datetime
import uuid
from typing import List, Optional

from pydantic import BaseModel


class Fandom(BaseModel):
	name: str


class Audio(BaseModel):
	title: str
	creator: str


class BaseFanvid(BaseModel):
	title: str
	author: str
	premiere_date: Optional[datetime.date] = None
	premiere_event: Optional[str] = None
	audio: Optional[Audio] = None
	length: datetime.timedelta
	rating: str
	fandoms: List[Fandom] = []
	summary: str
	content_notes: List[str] = []
	urls: List[str] = []
	unique_identifiers: List[str] = []
	thumbnail_url: str

	# Internal
	state: str
	created_timestamp: datetime.datetime
	modified_timestamp: datetime.datetime

class CreateFanvid(BaseFanvid):
	pass

class Fanvid(BaseFanvid):
	uuid: uuid.UUID
