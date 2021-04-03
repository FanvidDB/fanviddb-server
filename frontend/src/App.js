import React from "react";
import { Layout, Row, Col } from "antd";
import "./App.less";
import Text from "./components/Text";
import LoginForm from "./auth/LoginForm";
import { Localized } from "@fluent/react";

const { Content } = Layout;

const App = () => (
  <Layout>
    <Content>
      <Row>
        <Col span={12} offset={6}>
          <h1>
            <Localized id="hello-world">FanvidDB</Localized>
          </h1>
          <Text>
            Welcome! FanvidDB is a central repository for fanvid-related
            metadata, in particular for integration with{" "}
            <a href="https://plex.tv">Plex</a>. Check out the links in the
            navbar for more information.
          </Text>

          <LoginForm />

          <Text>
            <a href="/redoc">Redoc</a> – <a href="/docs">Swagger UI</a>
          </Text>
        </Col>
      </Row>
    </Content>
  </Layout>
);

export default App;
