import React from "react";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";

class RegisterForm extends React.Component {
  render() {
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
        <Form.Item
          label={<Localized id="register-form-username-label" />}
          name="username"
          rules={[
            {
              required: true,
              message: <Localized id="register-form-username-error-required" />,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={<Localized id="register-form-email-label" />}
          name="email"
          rules={[
            {
              required: true,
              message: <Localized id="register-form-email-error-required" />,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<Localized id="register-form-password-label" />}
          name="password"
          rules={[
            {
              required: true,
              message: <Localized id="register-form-password-error-required" />,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit">
            <Localized id="register-form-register-button" />
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default RegisterForm;
