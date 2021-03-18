import datetime
import uuid
from typing import List

import factory  # type: ignore

from fanviddb.db import database
from fanviddb.fanvids.db import fanvids


class FanvidFactory(factory.Factory):
    class Meta:
        model = fanvids

    uuid = factory.LazyFunction(uuid.uuid4)
    title = "Fanvid"
    creators = ["creator1"]
    premiere_date = datetime.date(2021, 1, 5)
    premiere_event = "Festivids 2020"
    audio_title = "Starship Iris: Episode 3"
    audio_artists_or_sources = ["Starship Iris"]
    audio_language = "en-us"
    length = datetime.timedelta(minutes=3, seconds=15)
    rating = "Gen"
    fandoms = ["The Locked Tomb Series"]
    summary = "This is a summary of the fanvid."
    content_notes: List[str] = []
    urls = ["https://google.com"]
    unique_identifiers: List[str] = []
    thumbnail_url = "https://tile.loc.gov/storage-services/service/pnp/cph/3c00000/3c00000/3c00100/3c00170_150px.jpg#h=150&w=121"  # noqa: E501

    state = "active"
    created_timestamp = factory.LazyFunction(datetime.datetime.utcnow)
    modified_timestamp = factory.LazyFunction(datetime.datetime.utcnow)

    @classmethod
    def _create(_, model_class, **kwargs):
        async def create_coro(**kwargs):
            stmt = model_class.insert().values(**kwargs)
            await database.execute(stmt)
            return kwargs

        return create_coro(**kwargs)

    @classmethod
    def _build(_, model_class, **kwargs):
        return kwargs
