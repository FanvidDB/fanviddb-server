import React, { useState, useEffect } from "react";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import {
  LocalizationProvider as FluentProvider,
  ReactLocalization,
} from "@fluent/react";
import PropTypes from "prop-types";

// Load locales from files.
async function getMessages(locale) {
  const url = `/static/locale/${locale}/react.ftl`;
  const response = await fetch(url);
  return await response.text();
}

const LocalizationProvider = ({ locales, children }) => {
  const [bundles, setBundles] = useState({});

  useEffect(() => {
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

    for (const locale of locales) {
      loadBundle(locale);
    }
  }, [locales]);

  const fluentBundles = !locales
    ? []
    : locales
        .map((locale) => bundles[locale])
        .filter((bundle) => bundle && bundle !== true);
  return (
    <FluentProvider l10n={new ReactLocalization(fluentBundles)}>
      {children}
    </FluentProvider>
  );
};

LocalizationProvider.propTypes = {
  locales: PropTypes.array,
  children: PropTypes.element.isRequired,
};

export default LocalizationProvider;
