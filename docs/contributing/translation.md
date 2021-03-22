---
layout: default
title: Translation
---

# Translation

In general, translation is handled by tying a "message id" (`msgid`) – that is, a string that is being translated – to a "message string" (`msgstr`) – that is, the translated string. The message ids are automatically extracted from code, but the translations have to be done by humans. Translations are grouped by "locale", which is more or less a regional variant of a specific language.

For example, here is a sample translation from an en_US (US English) message id to a de_AT (Austrian German) message string:

```po
msgid "Welcome to FanvidDB!"
msgstr "Wilkommen bei FanvidDB!"
```

If you are interested in helping out with translation, there are links below to find the various message ids and strings for the different parts of FanvidDB.

- [Backend](https://github.com/FanvidDB/fanviddb-server/tree/main/locale): The backend is anything generated on the server – for example, emails sent to users during registration.

## Adding new languages

For details on adding new languages, check out the different parts of the "Coding" menu.
