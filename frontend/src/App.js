import React from "react";
import { Layout } from "antd";
import "./App.less";
import "intl-pluralrules";
import FanvidListPage from "./fanvids/FanvidListPage";
import Http500Page from "./pages/Http500Page";
import Http404Page from "./pages/Http404Page";
import RegisterPage from "./auth/RegisterPage";
import SendVerificationEmailPage from "./auth/SendVerificationEmailPage";
import VerifyEmailPage from "./auth/VerifyEmailPage";
import LocalizationProvider from "./i18n/LocalizationProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext";
import LoginPage from "./auth/LoginPage";
import RequireAuth from "./auth/RequireAuth";
import TopNavbar from "./layout/TopNavbar";
import SideNav from "./layout/SideNav";
import BottomNav from "./layout/BottomNav";
import FanvidCreatePage from "./fanvids/FanvidCreatePage";
import FanvidEditPage from "./fanvids/FanvidEditPage";
import FanvidViewPage from "./fanvids/FanvidViewPage";

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
                  <Route exact path="/login">
                    <LoginPage />
                  </Route>
                  <Route exact path="/register">
                    <RegisterPage />
                  </Route>
                  <Route exact path="/verify-email/send">
                    <SendVerificationEmailPage />
                  </Route>
                  <Route exact path="/verify-email/:token">
                    <VerifyEmailPage />
                  </Route>
                  <Route exact path="/fanvids/add">
                    <RequireAuth>
                      <FanvidCreatePage />
                    </RequireAuth>
                  </Route>
                  <Route exact path="/fanvids/edit/:uuid">
                    <RequireAuth>
                      <FanvidEditPage />
                    </RequireAuth>
                  </Route>
                  <Route exact path="/fanvids/view/:uuid">
                    <FanvidViewPage />
                  </Route>
                  <Route exact path="/404">
                    <Http404Page />
                  </Route>
                  <Route exact path="/500">
                    <Http500Page />
                  </Route>
                  <Route exact path="/">
                    <RequireAuth>
                      <FanvidListPage />
                    </RequireAuth>
                  </Route>
                  <Route path="*">
                    <Http404Page />
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
