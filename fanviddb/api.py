from fastapi import FastAPI
from starlette.routing import Route
from starlette.staticfiles import StaticFiles

from .auth.routers import auth_router
from .auth.routers import users_router
from .db import database
from .fanvids.router import router as fanvid_router

app = FastAPI(
    routes=[
        Route("/", endpoint=StaticFiles(directory="static", html=True), name="homepage")
    ],
)
app.include_router(
    fanvid_router,
    prefix="/fanvids",
    tags=["Fanvids"],
)
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"],
)
app.include_router(
    users_router,
    prefix="/users",
    tags=["Users"],
)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
