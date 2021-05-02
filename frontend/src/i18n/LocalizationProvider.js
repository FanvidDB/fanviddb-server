import React, { useState, useEffect } from "react";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import { ConfigProvider as AntdConfigProvider } from "antd";
import {
  LocalizationProvider as FluentProvider,
  ReactLocalization,
} from "@fluent/react";
import PropTypes from "prop-types";
import { DEFAULT_LOCALE, AVAILABLE_LOCALES, localeMap } from "./config";
import moment from "moment";
import { negotiateLanguages } from "@fluent/langneg";

export const LocaleContext = React.createContext();

// Load locales from files.
async function getMessages(locale) {
  const url = `/static/locale/${locale}/react.ftl`;
  const response = await fetch(url);
  return await response.text();
}

const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [bundles, setBundles] = useState({});
  const [currentLocales, setCurrentLocales] = useState([DEFAULT_LOCALE]);

  useEffect(() => {
    let locales = navigator.languages;
    if (locale !== null) {
      locales = [locale].concat(locales);
    }
    locales = negotiateLanguages(locales, AVAILABLE_LOCALES, {
      defaultLocale: DEFAULT_LOCALE,
    });
    const momentLocale = localeMap[locale].moment;
    moment.locale(momentLocale);
    setCurrentLocales(locales);
  }, [locale]);

  useEffect(() => {
    for (const currentLocale of currentLocales) {
      if (!bundles[currentLocale]) {
        setBundles((bundles) => ({ ...bundles, [currentLocale]: true }));
        getMessages(currentLocale).then((ftl) => {
          const bundle = new FluentBundle(currentLocale);
          bundle.addResource(new FluentResource(ftl));
          setBundles((bundles) => ({ ...bundles, [currentLocale]: bundle }));
        });
      }
    }
  }, [currentLocales, bundles]);

  const antdLocale = localeMap[locale].antd;

  const fluentBundles = currentLocales
    .map((locale) => bundles[locale])
    .filter((bundle) => bundle && bundle !== true);
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <AntdConfigProvider locale={antdLocale}>
        <FluentProvider l10n={new ReactLocalization(fluentBundles)}>
          {children}
        </FluentProvider>
      </AntdConfigProvider>
    </LocaleContext.Provider>
  );
};

LocalizationProvider.propTypes = {
  locales: PropTypes.array,
  children: PropTypes.element.isRequired,
};

export default LocalizationProvider;
