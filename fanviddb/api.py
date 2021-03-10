import datetime
import uuid
from typing import List, Optional

from fastapi import FastAPI

from fanviddb.models import CreateFanvid, Fanvid

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post("/fanvids", response_model=Fanvid, tags=["Fanvids"])
async def create_fanvid(fanvid: CreateFanvid):
    fanvid_dict = fanvid.dict()
    fanvid_dict['uuid'] = uuid.uuid4()
    return fanvid_dict


@app.get("/fanvids", response_model=List[Fanvid], tags=["Fanvids"])
async def read_fanvid_list():
    return [
        {
           "uuid": uuid.uuid4(),
           "title": "Title",
           "author": "Author",
           "premiere_date": None,
           "premiere_event": None,
           "audio": None,
           "length": datetime.timedelta(1),
           "rating": "Gen",
           "fandoms": [],
           "summary": "Summary!",
           "content_notes": ["Graphic depictions of violence"],
           "urls": ["https://archiveofourown.org/works/29759784"],
           "unique_identifiers": [],
           "thumbnail_url": "https://i.vimeocdn.com/video/1072432518.jpg?mw=1280&mh=720&q=70",
           "state": "active",
           "created_timestamp": datetime.datetime.utcnow(),
           "modified_timestamp": datetime.datetime.utcnow(),
       },
    ]


@app.get("/fanvid/{fanvid_uuid}", response_model=Fanvid, tags=["Fanvids"])
async def read_fanvid(fanvid_uuid: uuid.UUID):
    return {
        "uuid": fanvid_uuid,
        "title": "Title",
        "author": "Author",
        "premiere_date": None,
        "premiere_event": None,
        "audio": None,
        "length": datetime.timedelta(1),
        "rating": "Gen",
        "fandoms": [],
        "summary": "Summary!",
        "content_notes": ["Graphic depictions of violence"],
        "urls": ["https://archiveofourown.org/works/29759784"],
        "unique_identifiers": [],
        "thumbnail_url": "https://i.vimeocdn.com/video/1072432518.jpg?mw=1280&mh=720&q=70",
        "state": "active",
        "created_timestamp": datetime.datetime.utcnow(),
        "modified_timestamp": datetime.datetime.utcnow(),
    }
