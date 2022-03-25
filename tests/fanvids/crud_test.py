import string

import pytest

from fanviddb.fanvids.constants import VIDEO_EXTENSIONS
from fanviddb.fanvids.crud import filename_to_tsquery


def test_filename_to_tsquery__basic():
    filename = "Hello"
    tsquery = filename_to_tsquery(filename)
    params = tsquery.compile().params
    assert params["param_1"] == "english"
    assert params["to_tsquery_1"] == "Hello"


@pytest.mark.parametrize("suffix", list(VIDEO_EXTENSIONS))
def test_filename_to_tsquery__removes_suffix(suffix):
    filename = f"Hello{suffix}"
    tsquery = filename_to_tsquery(filename)
    params = tsquery.compile().params
    assert params["param_1"] == "english"
    assert params["to_tsquery_1"] == "Hello"


@pytest.mark.parametrize("punctuation", set(string.punctuation) - {"/"})
def test_filename_to_tsquery__removes(punctuation):
    filename = f"Fandom{punctuation}Creator{punctuation}Title{punctuation}"
    tsquery = filename_to_tsquery(filename)
    params = tsquery.compile().params
    assert params["param_1"] == "english"
    assert params["to_tsquery_1"] == "Fandom | Creator | Title"
