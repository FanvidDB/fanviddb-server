import React from "react";
import { Layout } from "antd";
import "./App.less";
import "intl-pluralrules";
import HomePage from "./pages/HomePage";
import Http500Page from "./pages/Http500Page";
import Http404Page from "./pages/Http404Page";
import RegisterPage from "./auth/RegisterPage";
import SendVerificationEmailPage from "./auth/SendVerificationEmailPage";
import VerifyEmailPage from "./auth/VerifyEmailPage";
import LocalizationProvider from "./i18n/LocalizationProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext";
import RequireAuth from "./auth/RequireAuth";
import TopNavbar from "./layout/TopNavbar";
import SideNav from "./layout/SideNav";
import BottomNav from "./layout/BottomNav";
import FanvidEditPage from "./fanvids/FanvidEditPage";

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
                <SideNav />
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
                  <Route path="/fanvids/add">
                    <RequireAuth>
                      <FanvidEditPage />
                    </RequireAuth>
                  </Route>
                  <Route path="/fanvids/edit/:uuid">
                    <RequireAuth>
                      <FanvidEditPage />
                    </RequireAuth>
                  </Route>
                  <Route path="/404">
                    <Http404Page />
                  </Route>
                  <Route path="/500">
                    <Http500Page />
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
