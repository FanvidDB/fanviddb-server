import React, { useState, useEffect } from "react";
import { ConfigProvider as AntdConfigProvider, Layout, Row, Col } from "antd";
import "./App.less";
import "intl-pluralrules";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import FluentLocalization from "./i18n/FluentLocalization";
import { getLocales, DEFAULT_LOCALE } from "./i18n/utils";
import LocaleSelector from "./i18n/LocaleSelector";
import moment from "moment";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const { Content } = Layout;

const App = () => {
  const [locales, setLocales] = useState(getLocales(DEFAULT_LOCALE));

  useEffect(() => {
    moment.locale(locales.momentLocale);
  });

  return (
    <AntdConfigProvider locale={locales.antdLocale}>
      <FluentLocalization locales={locales.fluentLocales}>
        <Router>
          <Layout>
            <Content>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <LocaleSelector
                    locale={locales.selectedLocale}
                    onChange={(e) => setLocales(getLocales(e.target.value))}
                  />
                </Col>
                <Col span={12}>
                  <Switch>
                    <Route path="/register">
                      <RegisterPage />
                    </Route>
                    <Route path="/">
                      <LoginPage />
                    </Route>
                  </Switch>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Router>
      </FluentLocalization>
    </AntdConfigProvider>
  );
};

export default App;
