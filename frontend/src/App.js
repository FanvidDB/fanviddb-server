import React, { useState, useEffect } from "react";
import { ConfigProvider as AntdConfigProvider, Layout, Row, Col } from "antd";
import "./App.less";
import "intl-pluralrules";
import HomePage from "./pages/HomePage";
import RegisterPage from "./auth/RegisterPage";
import SendVerificationEmailPage from "./auth/SendVerificationEmailPage";
import VerifyEmailPage from "./auth/VerifyEmailPage";
import FluentLocalization from "./i18n/FluentLocalization";
import { getLocales, DEFAULT_LOCALE } from "./i18n/utils";
import LocaleSelector from "./i18n/LocaleSelector";
import moment from "moment";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext";

const { Content } = Layout;

const App = () => {
  const [locales, setLocales] = useState(() => {
    const initialLocales = getLocales(DEFAULT_LOCALE);
    return initialLocales;
  });

  useEffect(() => {
    moment.locale(locales.momentLocale);
  }, [locales.momentLocale]);

  return (
    <AntdConfigProvider locale={locales.antdLocale}>
      <FluentLocalization locales={locales.fluentLocales}>
        <AuthProvider>
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
                      <Route path="/verify-email/send">
                        <SendVerificationEmailPage />
                      </Route>
                      <Route path="/verify-email/:token">
                        <VerifyEmailPage />
                      </Route>
                      <Route path="/">
                        <HomePage />
                      </Route>
                    </Switch>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Router>
        </AuthProvider>
      </FluentLocalization>
    </AntdConfigProvider>
  );
};

export default App;
