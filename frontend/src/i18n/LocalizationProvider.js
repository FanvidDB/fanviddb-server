import React, { useState, useEffect } from "react";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import { ConfigProvider as AntdConfigProvider } from "antd";
import {
  LocalizationProvider as FluentProvider,
  ReactLocalization,
} from "@fluent/react";
import PropTypes from "prop-types";
import { getLocales, DEFAULT_LOCALE } from "./utils";
import moment from "moment";

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
  const [antdLocale, setAntdLocale] = useState(DEFAULT_LOCALE.replace("-", ""));
  const [fluentLocales, setFluentLocales] = useState([DEFAULT_LOCALE]);

  useEffect(() => {
    console.log(locale);
    const loadBundle = (locale) => {
      if (!bundles[locale]) {
        setBundles((bundles) => ({ ...bundles, [locale]: true }));
        getMessages(locale).then((ftl) => {
          const bundle = new FluentBundle(locale);
          bundle.addResource(new FluentResource(ftl));
          setBundles((bundles) => ({ ...bundles, [locale]: bundle }));
        });
      }
    };

    const locales = getLocales(locale);

    for (const locale of locales.fluentLocales) {
      loadBundle(locale);
    }

    moment.locale(locales.momentLocale);
    setAntdLocale(locales.antdLocale);
    setFluentLocales(locales.fluentLocales);
  }, [locale]);

  const fluentBundles = fluentLocales
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
