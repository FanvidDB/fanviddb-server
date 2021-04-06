import { negotiateLanguages } from "@fluent/langneg";

export const DEFAULT_LOCALE = "en-US";
export const AVAILABLE_LOCALES = ["en-US", "zh-CN"];

export function getLocales(locale) {
  let userLanguages = navigator.languages;
  if (locale !== null) {
    userLanguages = [locale].concat(userLanguages);
  }

  const fluentLocales = negotiateLanguages(userLanguages, AVAILABLE_LOCALES, {
    defaultLocale: DEFAULT_LOCALE,
  });

  const currentLocale = fluentLocales[0];

  return {
    selectedLocale: locale,
    antdLocale: currentLocale.replace("-", ""),
    fluentLocales,
    momentLocale: currentLocale == "en-US" ? "en" : "zh-cn",
  };
}
