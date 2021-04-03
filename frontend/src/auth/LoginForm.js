import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";

class LoginForm extends React.Component {
  render() {
    return (
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
          rules={[{ required: true, message: "Please enter your password." }]}
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
    );
  }
}

LoginForm.propTypes = {
  children: PropTypes.element.isRequired,
};

export default LoginForm;
