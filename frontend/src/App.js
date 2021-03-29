import React from "react";
import { Button, Form, Input, Layout, Row, Col } from "antd";
import "./App.less";

const { Content } = Layout;

const App = () => (
  <Layout>
    <Content>
      <Row>
        <Col span={12} offset={6}>
          <h1>FanvidDB</h1>

          <p>
            Welcome! FanvidDB is a central repository for fanvid-related
            metadata, in particular for integration with{" "}
            <a href="https://plex.tv">Plex</a>. Check out the links in the
            navbar for more information.
          </p>

          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email." }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password." },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
              <Button type="link" href="/docs">
                Forgot my password
              </Button>
              <Button type="link" href="/docs">
                Register
              </Button>
            </Form.Item>
          </Form>

          <p>
            <a href="/redoc">Redoc</a> – <a href="/docs">Swagger UI</a>
          </p>
        </Col>
      </Row>
    </Content>
  </Layout>
);

export default App;
