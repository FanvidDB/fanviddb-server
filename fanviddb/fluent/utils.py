from typing import List

from fluent.runtime import FluentLocalization
from fluent.runtime import FluentResourceLoader
from starlette.requests import Request
from fastapi import Query

from .models import DEFAULT_LOCALE
from .models import Locale


def get_request_locales(request: Request) -> List[Locale]:
    locales = request.query_params.get("locales")
    if not locales:
        return [DEFAULT_LOCALE]
    return [Locale(locale) for locale in locales]


def get_fluent(locales):
    loader = FluentResourceLoader("locale/{locale}")
    return FluentLocalization(locales, ["python.ftl"], loader)


def fluent_dependency(locales: List[Locale] = Query([DEFAULT_LOCALE])):
    return get_fluent(locales)
