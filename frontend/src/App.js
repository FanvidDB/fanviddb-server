import React from "react";
import { Layout } from "antd";
import "./App.less";
import "intl-pluralrules";
import HomePage from "./pages/HomePage";
import RegisterPage from "./auth/RegisterPage";
import SendVerificationEmailPage from "./auth/SendVerificationEmailPage";
import VerifyEmailPage from "./auth/VerifyEmailPage";
import LocalizationProvider from "./i18n/LocalizationProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext";
import TopNavbar from "./layout/TopNavbar";
import BottomNav from "./layout/BottomNav";

const { Content, Header, Footer, Sider } = Layout;

const App = () => {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Header>
              <TopNavbar />
            </Header>
            <Layout>
              <Sider width={200} style={{ padding: "24px" }}>
                {/* Currently empty */}
              </Sider>
              <Content style={{ padding: "24px", minHeight: "280px" }}>
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
              </Content>
            </Layout>
            <Footer>
              <BottomNav />
            </Footer>
          </Layout>
        </Router>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default App;
