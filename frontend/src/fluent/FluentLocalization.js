import React from "react";
import "intl-pluralrules";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import { LocalizationProvider, ReactLocalization } from "@fluent/react";
import PropTypes from "prop-types";
import _ from "lodash";

// Load locales from files.
async function getMessages(locale) {
  const url = `/static/locale/${locale}/react.ftl`;
  const response = await fetch(url);
  return await response.text();
}

class FluentLocalization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bundles: {},
    };
  }

  componentDidMount() {
    if (this.props.locales) {
      for (const locale of this.props.locales) {
        this.loadBundle(locale);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.locales, this.props.locales)) {
      for (const locale of this.props.locales) {
        this.loadBundle(locale);
      }
    }
  }

  loadBundle(locale) {
    if (!this.state.bundles[locale]) {
      this.setBundle(locale, true);
      getMessages(locale).then((ftl) => {
        const bundle = new FluentBundle(locale);
        bundle.addResource(new FluentResource(ftl));
        this.setBundle(locale, bundle);
      });
    }
  }

  setBundle(locale, bundle) {
    this.setState((state) => {
      let bundles = { ...state.bundles };
      bundles[locale] = bundle;
      return { bundles };
    });
  }

  render() {
    const { locales } = this.props;
    const bundles = !locales
      ? []
      : locales
          .map((locale) => this.state.bundles[locale])
          .filter((bundle) => bundle && bundle !== true);
    return (
      <LocalizationProvider l10n={new ReactLocalization(bundles)}>
        {this.props.children}
      </LocalizationProvider>
    );
  }
}

FluentLocalization.propTypes = {
  locales: PropTypes.array,
  children: PropTypes.element.isRequired,
};

export default FluentLocalization;
