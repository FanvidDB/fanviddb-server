from enum import StrEnum


class Locale(StrEnum):
    en_US = "en-US"
    zh_CN = "zh-CN"


DEFAULT_LOCALE = Locale.en_US
