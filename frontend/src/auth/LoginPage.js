import React, { useContext } from "react";
import Helmet from "react-helmet";
import LoginForm from "./LoginForm";
import { Localized, useLocalization } from "@fluent/react";
import AuthContext from "./authContext";

const LoginPage = () => {
  const { loadUserData } = useContext(AuthContext);
  const { l10n } = useLocalization();
  const onLogin = () => {
    loadUserData();
  };
  return (
    <>
      <Helmet>
        <title>{l10n.getString("login-page-title-bar")}</title>
      </Helmet>
      <h1>
        <Localized id="login-page-title">FanvidDB</Localized>
      </h1>
      <p>
        <Localized
          id="login-page-intro"
          elems={{
            plexLink: <a href="https://plex.tv" />,
          }}
        >
          <span></span>
        </Localized>
      </p>

      <LoginForm onLogin={onLogin} />
    </>
  );
};

export default LoginPage;
