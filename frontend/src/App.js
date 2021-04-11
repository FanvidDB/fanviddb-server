import React from "react";
import { ConfigProvider as AntdConfigProvider, Layout, Row, Col } from "antd";
import "./App.less";
import "intl-pluralrules";
import HomePage from "./auth/HomePage";
import FluentLocalization from "./i18n/FluentLocalization";
import { getLocales, DEFAULT_LOCALE } from "./i18n/utils";
import LocaleSelector from "./i18n/LocaleSelector";
import moment from "moment";

const { Content } = Layout;

class App extends React.Component {
  constructor() {
    super();
    this.state = getLocales(DEFAULT_LOCALE);
    moment.locale(this.state.momentLocale);
    this.onSelectLocale = this.onSelectLocale.bind(this);
  }

  onSelectLocale(e) {
    this.setState(getLocales(e.target.value));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.momentLocale != prevState.momentLocale) {
      moment.locale(this.state.momentLocale);
    }
  }

  render() {
    return (
      <AntdConfigProvider locale={this.state.antdLocale}>
        <FluentLocalization locales={this.state.fluentLocales}>
          <Layout>
            <Content>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
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
