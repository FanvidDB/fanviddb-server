import React, { useContext } from "react";
import LoginForm from "./LoginForm";
import { Localized } from "@fluent/react";
import AuthContext from "./authContext";

const LoginPage = () => {
  const { loadUserData } = useContext(AuthContext);
  const onLogin = () => {
    loadUserData();
  };
  return (
    <div>
      <h1>
        <Localized id="homepage-title">FanvidDB</Localized>
      </h1>
      <p>
        <Localized
          id="homepage-intro"
          elems={{
            plexLink: <a href="https://plex.tv" />,
          }}
        >
          <span></span>
        </Localized>
      </p>

      <LoginForm onLogin={onLogin} />

      <p>
        <a href="/redoc">Redoc</a> – <a href="/docs">Swagger UI</a>
      </p>
    </div>
  );
};

export default LoginPage;
