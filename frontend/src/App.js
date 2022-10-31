import React from "react";
import { Layout } from "antd";
import "./App.less";
import "intl-pluralrules";
import FanvidListPage from "./fanvids/FanvidListPage";
import Http500Page from "./pages/Http500Page";
import Http404Page from "./pages/Http404Page";
import RegisterPage from "./auth/RegisterPage";
import SendVerificationEmailPage from "./auth/SendVerificationEmailPage";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import VerifyEmailPage from "./auth/VerifyEmailPage";
import ResetPasswordPage from "./auth/ResetPasswordPage";
import LocalizationProvider from "./i18n/LocalizationProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
                <Routes>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route
                    path="verify-email/send"
                    element={<SendVerificationEmailPage />}
                  />
                  <Route
                    path="verify-email/:token"
                    element={<VerifyEmailPage />}
                  />
                  <Route
                    path="forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="reset-password/:token"
                    element={<ResetPasswordPage />}
                  />
                  <Route
                    path="fanvids/add"
                    element={
                      <RequireAuth>
                        <FanvidCreatePage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="fanvids/edit/:uuid"
                    element={
                      <RequireAuth>
                        <FanvidEditPage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="fanvids/view/:uuid"
                    element={<FanvidViewPage />}
                  />
                  <Route path="404" element={<Http404Page />} />
                  <Route path="500" element={<Http500Page />} />
                  <Route
                    path="/"
                    element={
                      <RequireAuth>
                        <FanvidListPage />
                      </RequireAuth>
                    }
                  />
                  <Route path="*" element={<Http404Page />} />
                </Routes>
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
