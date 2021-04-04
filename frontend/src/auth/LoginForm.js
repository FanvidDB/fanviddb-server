import React from "react";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";

class LoginForm extends React.Component {
  render() {
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
        <Form.Item
          label={<Localized id="login-form-email-label" />}
          name="email"
          rules={[
            {
              required: true,
              message: <Localized id="login-form-email-error-required" />,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<Localized id="login-form-password-label" />}
          name="password"
          rules={[
            {
              required: true,
              message: <Localized id="login-form-email-error-required" />,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit">
            <Localized id="login-form-login-button" />
          </Button>
          <Button type="link" href="/docs">
            <Localized id="login-form-forgot-password-link" />
          </Button>
          <Button type="link" href="/docs">
            <Localized id="login-form-register-link" />
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;
