from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.applications import Starlette
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

from .api_keys.router import api_key_router
from .auth.routers import auth_router
from .auth.routers import users_router
from .db import database
from .email import EmailSendFailed
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


main_app = Starlette()

api = FastAPI(docs_url=None)

api.include_router(
    fanvid_router,
    prefix="/fanvids",
    tags=["Fanvids"],
)
api.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"],
)
api.include_router(
    users_router,
    prefix="/users",
    tags=["Users"],
)
api.include_router(
    api_key_router,
    prefix="/api_keys",
    tags=["API Keys"],
)


frontend = Starlette()


@frontend.middleware("http")
async def default_response(request, call_next):
    response = await call_next(request)
    if response.status_code == 404:
        return FileResponse("frontend/build/index.html")
    return response


frontend.mount(
    "/", HelpfulStaticFiles(directory="frontend/build/", html=True, check_dir=False)
)
main_app.mount(
    "/static/locale",
    app=StaticFiles(directory="locale"),
    name="locale",
)
main_app.mount(
    "/static",
    app=HelpfulStaticFiles(
        directory="frontend/build/static/", html=True, check_dir=False
    ),
    name="static",
)
main_app.mount(
    "/api",
    api,
    name="api",
)
main_app.mount(
    "/",
    frontend,
    name="frontend",
)


@main_app.on_event("startup")
async def startup():
    await database.connect()


@main_app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@api.exception_handler(EmailSendFailed)
async def email_send_failed_handler(__: Request, exc: EmailSendFailed):
    return JSONResponse(
        status_code=503,
        headers={"retry-after": "300"},
        content={
            "error": "Email send failed; please retry in a few minutes",
        },
    )
