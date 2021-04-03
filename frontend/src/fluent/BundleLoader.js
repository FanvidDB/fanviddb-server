import React from "react";
import "intl-pluralrules";
import { negotiateLanguages } from "@fluent/langneg";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import { LocalizationProvider, ReactLocalization } from "@fluent/react";
import PropTypes from "prop-types";

const AVAILABLE_LOCALES = ["en-US", "zh-CN"];

// Negotiate user language.
const languages = negotiateLanguages(navigator.languages, AVAILABLE_LOCALES, {
  defaultLocale: "en-US",
});

// Load locales from files.
async function getMessages(locale) {
  const url = `/static/locale/${locale}/react.ftl`;
  const response = await fetch(url);
  return await response.text();
}

// Generate bundles for each locale.
async function generateBundles() {
  return languages.map(async (locale) => {
    const translations = await getMessages(locale);
    const bundle = new FluentBundle(locale);
    bundle.addResource(new FluentResource(translations));
    return bundle;
  });
}

class BundleLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      l10n: new ReactLocalization([]),
    };
  }

  componentDidMount() {
    generateBundles().then((bundlePromises) => {
      Promise.all(bundlePromises).then((bundles) => {
        console.log(bundles);
        this.setState({ l10n: new ReactLocalization(bundles) });
      });
    });
  }

  render() {
    return (
      <LocalizationProvider l10n={this.state.l10n}>
        {this.props.children}
      </LocalizationProvider>
    );
  }
}

BundleLoader.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BundleLoader;
