from typing import List
from typing import Optional

from fastapi import Query
from fluent.runtime import FluentLocalization  # type: ignore
from fluent.runtime import FluentResourceLoader  # type: ignore
from starlette.requests import Request

from .models import DEFAULT_LOCALE
from .models import Locale


def get_request_locales(request: Optional[Request] = None) -> List[Locale]:
    locales = request.query_params.get("locales") if request else None
    if not locales:
        return [DEFAULT_LOCALE]
    return [Locale(locale) for locale in locales]


def get_fluent(locales):
    loader = FluentResourceLoader("locale/{locale}")
    return FluentLocalization(locales, ["python.ftl"], loader)


def fluent_dependency(locales: List[Locale] = Query([DEFAULT_LOCALE])):
    return get_fluent(locales)
