from enum import Enum


class Locale(str, Enum):
    en_US = "en-US"
    zh_CN = "zh-CN"


DEFAULT_LOCALE = Locale.en_US
DEFAULT_LOCALE = Locale.zh_CN
