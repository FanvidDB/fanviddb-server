import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";
import PasswordStrengthBar from "./PasswordStrengthBar";
import zxcvbn from "zxcvbn";
import _ from "lodash";
import PropTypes from "prop-types";
import { callApi } from "../api";

const RegisterForm = ({ onRegister }) => {
  const [form] = Form.useForm();
  const [submitState, setSubmitState] = useState();

  const onFinish = (values: any) => {
    setSubmitState("submitting");
    callApi("/api/auth/register", "POST", values)
      .then(({ status, ok, json }) => {
        let errors = {};
        if (status == 400) {
          if (json.detail == "REGISTER_USERNAME_ALREADY_EXISTS") {
            errors.username = [
              <Localized
                key="username-error"
                id="register-form-username-error-already-exists"
              />,
            ];
          } else {
            errors.email = [
              <Localized
                key="email-error"
                id="register-form-email-error-already-exists"
              />,
            ];
          }
        } else if (!ok) {
          errors.username = [
            <Localized
              key="email-error"
              id="register-form-username-error-unknown"
            />,
          ];
        }

        if (_.isEmpty(errors)) {
          onRegister(json);
        } else {
          setSubmitState();
          for (const name in errors) {
            form.setFields([
              {
                name: name,
                errors: errors[name],
              },
            ]);
          }
        }
      })
      .catch((error) => {
        setSubmitState(undefined);
        console.error("Error:", error);
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
        rules={[
          {
            required: true,
            message: <Localized id="register-form-password-error-required" />,
          },
          {
            validateTrigger: "onSubmit",
            validator: (_, password) => {
              // Limit to 100 characters for performance reasons.
              const passwordStrength = zxcvbn(
                (password || "").substring(0, 100)
              );
              if (passwordStrength.score >= 4) {
                return Promise.resolve();
              }
              let errors = [];
              const { warning, suggestions } = passwordStrength.feedback;
              if (warning) {
                errors.push(warning);
              }
              if (suggestions) {
                errors = errors.concat(suggestions);
              }
              if (errors.length == 0) {
                errors.push(
                  <Localized id="register-form-password-error-stronger-password" />
                );
              }
              return Promise.reject(errors);
            },
          },
        ]}
        name="password"
      >
        <div>
          <Form.Item noStyle name="password">
            <Input.Password suffix={"hi"} />
          </Form.Item>
          <Form.Item noStyle name="password" valuePropName="password">
            <PasswordStrengthBar />
          </Form.Item>
        </div>
      </Form.Item>

      <Form.Item
        wrapperCol={{ offset: 4, span: 20 }}
        loading={submitState == "submitting"}
      >
        <Button type="primary" htmlType="submit">
          <Localized id="register-form-register-button" />
        </Button>
      </Form.Item>
    </Form>
  );
};

RegisterForm.propTypes = {
  onRegister: PropTypes.func,
};

export default RegisterForm;
