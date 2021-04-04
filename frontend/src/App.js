import React from "react";
import { Layout, Row, Col } from "antd";
import "./App.less";
import LoginForm from "./auth/LoginForm";
import { Localized } from "@fluent/react";

const { Content } = Layout;

const App = () => (
  <Layout>
    <Content>
      <Row>
        <Col span={12} offset={6}>
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
        </Col>
      </Row>
    </Content>
  </Layout>
);

export default App;
