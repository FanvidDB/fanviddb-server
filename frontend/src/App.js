import React from "react";
import { ConfigProvider as AntdConfigProvider, Layout, Row, Col } from "antd";
import "./App.less";
import HomePage from "./auth/HomePage";
import FluentLocalization from "./fluent/FluentLocalization";
import LocaleSelector from "./components/LocaleSelector";
import { negotiateLanguages } from "@fluent/langneg";
import moment from "moment";

const { Content } = Layout;
const DEFAULT_LOCALE = "en-US";
const AVAILABLE_LOCALES = ["en-US", "zh-CN"];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      antdLocale: null,
      fluentLocales: null,
    };
    this.setLocale(null);
    this.onSelectLocale = this.onSelectLocale.bind(this);
  }

  onSelectLocale(e) {
    this.setLocale(e.target.value);
  }

  setLocale(locale) {
    if (locale === null) {
      locale = DEFAULT_LOCALE;
    }

    const fluentLocales = negotiateLanguages(
      [locale].concat(navigator.languages),
      AVAILABLE_LOCALES,
      {
        defaultLocale: "en-US",
      }
    );

    this.setState({
      selectedLocale: locale,
      antdLocale: locale.replace("-", ""),
      fluentLocales,
    });
    if (locale == "en-US") {
      moment.locale("en");
    } else {
      moment.locale("zh-cn");
    }
  }

  render() {
    return (
      <AntdConfigProvider locale={this.state.antdLocale}>
        <FluentLocalization locales={this.state.fluentLocales}>
          <Layout>
            <Content>
              <Row>
                <Col span={6}>
                  <LocaleSelector
                    locale={this.state.selectedLocale}
                    onChange={this.onSelectLocale}
                  />
                </Col>
                <Col span={12}>
                  <HomePage />
                </Col>
              </Row>
            </Content>
          </Layout>
        </FluentLocalization>
      </AntdConfigProvider>
    );
  }
}

export default App;
