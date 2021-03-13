from fastapi import FastAPI

from .db import database
from .fanvids.router import router as fanvid_router

app = FastAPI()
app.include_router(
    fanvid_router,
    prefix="/fanvids",
    tags=["Fanvids"],
)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/")
async def read_root():
    return {"Hello": "World"}
