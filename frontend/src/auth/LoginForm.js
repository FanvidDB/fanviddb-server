import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";
import submitForm from "../forms/submitForm";
import PropTypes from "prop-types";

const LoginForm = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = ({ email, password }) => {
    submitForm({
      form,
      setIsSubmitting,
      defaultErrorField: "email",
      url: "/api/auth/login",
      values: { username: email, password },
      contentType: "application/x-www-form-urlencoded",
      getErrors: (status: number, json: {}): [] => {
        let errors = [];
        if (status == 400) {
          if (json.detail == "LOGIN_BAD_CREDENTIALS") {
            errors.push({
              name: "email",
              errors: [
                <Localized
                  key="email-error"
                  id="login-form-error-invalid-credentials"
                />,
              ],
            });
          } else if (json.detail == "LOGIN_USER_NOT_VERIFIED") {
            errors.push({
              name: "email",
              errors: [
                <Localized
                  key="email-error"
                  id="login-form-email-error-not-verified"
                  elems={{
                    sendVerificationEmailLink: (
                      <Link
                        to={{
                          pathname: "/verify-email/send",
                          search: `?email=${encodeURIComponent(email)}`,
                        }}
                      />
                    ),
                  }}
                >
                  <span></span>
                </Localized>,
              ],
            });
          }
        }
        return errors;
      },
      onSuccess: onLogin,
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
        <Link to="/forgot-password" className="ant-btn ant-btn-link">
          <Localized id="login-form-forgot-password-link" />
        </Link>
        <Link to="/register" className="ant-btn ant-btn-link">
          <Localized id="login-form-register-link" />
        </Link>
      </Form.Item>
    </Form>
  );
};

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
