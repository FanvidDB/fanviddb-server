from fastapi import FastAPI
from starlette.routing import Mount
from starlette.routing import Route
from starlette.staticfiles import StaticFiles

from .api_keys.router import api_key_router
from .auth.routers import auth_router
from .auth.routers import users_router
from .db import database
from .fanvids.router import router as fanvid_router


class HelpfulStaticFiles(StaticFiles):
    async def check_config(self) -> None:
        try:
            await super().check_config()
        except RuntimeError as exc:
            raise RuntimeError(
                "Static files do not exist; you may need to run `yarn build` to generate them.\n"
                "See https://docs.fanviddb.com/coding/frontend.html for details."
            ) from exc


app = FastAPI(
    routes=[
        Route(
            "/",
            endpoint=HelpfulStaticFiles(
                directory="frontend/build/", html=True, check_dir=False
            ),
            name="homepage",
        ),
        Mount(
            "/static",
            app=HelpfulStaticFiles(
                directory="frontend/build/static/", html=True, check_dir=False
            ),
            name="static",
        ),
    ],
)

app.include_router(
    fanvid_router,
    prefix="/api/fanvids",
    tags=["Fanvids"],
)
app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Auth"],
)
app.include_router(
    users_router,
    prefix="/api/users",
    tags=["Users"],
)
app.include_router(
    api_key_router,
    prefix="/api/api_keys",
    tags=["API Keys"],
)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
