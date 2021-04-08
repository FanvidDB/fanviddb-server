---
layout: default
title: Translation
---

# Translation

## How to write translations

We use [Fluent](https://projectfluent.org/) to handle translations, because we believe it provides the best experience for non-technical translators of the currently-available options.

- links to fluent syntax and translator best practices docs

## Quick changes in-browser

If you want to improve existing translations or add new translations for a language that's already supported, you might be able to do it from your web browser.

1. Create an account on [GitHub](https://github.com/).
2. Once you're signed up, visit <https://github.com/FanvidDB/fanviddb-server/tree/main/locale> and find the locale you want to edit. "Locales" are generally an [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) connected to an [ISO-3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Current_codes) with a hyphen) to represent a variant of a language as spoken in a specific region. For example:
   - `en-US`: English as spoken in the US, vs `en-UK` for the UK
   - `de-AT`: German as spoken in Austria, vs `de-DE` for Germany
   - `zh-CN`: Mandarin as spoken in China, vs `zh-TW` for Taiwanese
3. There are two files in each locale
   - `python.ftl` includes translations for the [backend](/coding/backend.html); these are generally going to be emails and API errors.
   - `react.ftl` includes translations for the [frontend](/coding/frontend.html); this is going to be the user interface of the website.

### Improving existing translations

1. Search `python.ftl` and `fluent.ftl` for the old translation
2. [Click on the "Edit" button](https://docs.github.com/en/github/managing-files-in-a-repository/editing-files-in-another-users-repository)
3. Update the translation.
4. Create a Pull Request.

### Adding new translations

1. If there's a translation missing, you will see a fallback in some other language. Go to the locale directory for the fallback language and search `python.ftl` and `fluent.ftl` for the fallback translation.
2. Note the [message id](https://projectfluent.org/fluent/guide/hello.html) to the left of the translation. Also note where in the file it is / what other translations are around it.
3. Open up the same file (`python.ftl` or `fluent.ftl`) in the locale directory you want to add a translation to.
4. [Click on the "Edit" button](https://docs.github.com/en/github/managing-files-in-a-repository/editing-files-in-another-users-repository)
5. In a similar location, add the message id and your translation.
6. Create a Pull Request.
