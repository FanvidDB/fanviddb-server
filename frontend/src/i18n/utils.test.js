import { getLocales } from "./utils";

test("defaults to default locale", () => {
  const locales = getLocales(null);
  expect(locales).toEqual({
    selectedLocale: null,
    antdLocale: "enUS",
    fluentLocales: ["en-US"],
    momentLocale: "en",
  });
});
