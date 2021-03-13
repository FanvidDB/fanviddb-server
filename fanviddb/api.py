from fastapi import FastAPI

from .fanvids.router import router as fanvid_router

app = FastAPI()
app.include_router(
    fanvid_router,
    prefix="/fanvids",
    tags=["Fanvids"],
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}
