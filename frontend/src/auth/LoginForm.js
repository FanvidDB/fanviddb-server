import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";
import _ from "lodash";
import { callApi } from "../api";

const LoginForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = ({ email, password }) => {
    callApi(
      "/api/auth/login",
      "POST",
      { username: email, password },
      "application/x-www-form-urlencoded"
    ).then(({ status, ok, json }) => {
      let errors = {};
      if (status == 400) {
        if (json.detail == "LOGIN_BAD_CREDENTIALS") {
          errors.email = [
            <Localized
              key="email-error"
              id="login-form-error-invalid-credentials"
            />,
          ];
        } else if (json.detail == "LOGIN_USER_NOT_VERIFIED") {
          errors.email = [
            <Localized
              key="email-error"
              id="login-form-email-error-not-verified"
              elems={{
                sendVerificationEmailLink: (
                  <Link
                    to={{
                      pathname: "/verify-email/send",
                      state: { sendToEmail: email },
                    }}
                  />
                ),
              }}
            >
              <span></span>
            </Localized>,
          ];
        }
      }

      if (_.isEmpty(errors) && !ok) {
        errors.email = [
          <Localized key="email-error" id="login-form-error-unknown" />,
        ];
      }
      setIsSubmitting(false);
      if (_.isEmpty(errors)) {
        // Success!
        console.log("logged in!");
      } else {
        for (const name in errors) {
          form.setFields([
            {
              name: name,
              errors: errors[name],
            },
          ]);
        }
      }
    });
  };
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      colon={false}
      onFinish={onFinish}
      form={form}
    >
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
            message: <Localized id="login-form-password-error-required" />,
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          <Localized id="login-form-login-button" />
        </Button>
        <Button type="link" href="/docs">
          <Localized id="login-form-forgot-password-link" />
        </Button>
        <Link to="/register" className="ant-btn ant-btn-link">
          <Localized id="login-form-register-link" />
        </Link>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
