import React from "react";
import LoginForm from "./LoginForm";
import { Localized } from "@fluent/react";

const LoginPage = () => (
  <div>
    <h1>
      <Localized id="homepage-title">FanvidDB</Localized>
    </h1>
    <Localized
      id="homepage-intro"
      elems={{
        plexLink: <a href="https://plex.tv" />,
      }}
    >
      <p>{"<plexLink>Hello</plexLink> world"}</p>
    </Localized>

    <LoginForm />

    <p>
      <a href="/redoc">Redoc</a> – <a href="/docs">Swagger UI</a>
    </p>
  </div>
);

export default LoginPage;
