#!/usr/bin/env python
import os
from operator import attrgetter

import click
from fluent.syntax import ast  # type: ignore
from fluent.syntax import parse  # type: ignore

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
LOCALE_DIR = os.path.join(BASE_DIR, "locale")
DEFAULT_LOCALE = "en-US"


def _percent_to_color(percent):
    if percent > 80:
        return "green"
    elif percent < 30:
        return "red"
    else:
        return "yellow"


class FluentFile:
    def __init__(self, locale, name):
        self.locale = locale
        self.name = name
        self.path = os.path.join(LOCALE_DIR, locale, name)
        self._ids = None

    @property
    def ids(self):
        if self._ids is None:
            with open(self.path) as fp:
                contents = fp.read()
                parsed = parse(contents)
            self._ids = {
                message.id.name
                for message in parsed.body
                if isinstance(message, ast.Message)
            }
        return self._ids


class Locale:
    def __init__(self, locale):
        self.name = locale
        self._ids = None
        self._files = None
        self.path = os.path.join(LOCALE_DIR, locale)

    @property
    def files(self):
        if self._files is None:
            self._files = sorted(
                (
                    FluentFile(self.name, filename)
                    for filename in os.listdir(self.path)
                    if filename[-4:] == ".ftl"
                ),
                key=attrgetter("name"),
            )

        return self._files

    @property
    def ids(self):
        if self._ids is None:
            self._ids = set()
            for file in self.files:
                self._ids |= file.ids
        return self._ids


@click.command()
@click.option("--show-missing-messages/--no-show-missing-messages", default=False)
@click.option("--locale", "-l", "show_locales", multiple=True)
def stats(show_missing_messages, show_locales):
    locales = {
        dir_entry.name: Locale(dir_entry.name)
        for dir_entry in os.scandir(LOCALE_DIR)
        if dir_entry.is_dir()
    }
    all_ids = set()
    all_ids_by_file = {}
    all_file_names = set()
    for locale in locales.values():
        all_ids |= locale.ids
        for file in locale.files:
            all_file_names.add(file.name)
            if file.name not in all_ids_by_file:
                all_ids_by_file[file.name] = set()
            all_ids_by_file[file.name] |= file.ids

    all_file_names = sorted(all_file_names)

    click.echo(f"Total messages: {len(all_ids)}")

    click.echo("Locales: (* = default)")
    for locale in sorted(locales.values(), key=attrgetter("name")):
        if show_locales and locale.name not in show_locales:
            continue
        percent = 100 * len(locale.ids) / len(all_ids)
        marker = "*" if locale.name == DEFAULT_LOCALE else "-"
        click.secho(
            f"{marker} {locale.name} {len(locale.ids)}/{len(all_ids)} ({percent:.1f}%)",
            fg=_percent_to_color(percent),
        )

        locale_files = {file.name: file for file in locale.files}
        for file_name in all_file_names:
            locale_file = locale_files.get(file_name)
            file_ids = locale_file.ids if locale_file else set()
            all_file_ids = all_ids_by_file[file_name]
            percent = 100 * len(file_ids) / len(all_file_ids)
            click.secho(
                f"    {file_name} {len(file_ids)}/{len(all_file_ids)} ({percent:.1f}%)",
                fg=_percent_to_color(percent),
            )

            if show_missing_messages:
                missing_messages = sorted(all_file_ids - locale.ids)
                if missing_messages:
                    click.echo("      Missing:")
                    for message in missing_messages:
                        click.echo(f"        {message}")


if __name__ == "__main__":
    stats()
