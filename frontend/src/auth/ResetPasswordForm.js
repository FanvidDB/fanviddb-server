import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Form } from "antd";
import { Localized } from "@fluent/react";
import _ from "lodash";
import { callApi } from "../api";
import { getApiErrors } from "../forms/apiErrors";
import PasswordInput from "../forms/PasswordInput";
import PropTypes from "prop-types";
import { passwordValidator } from "./RegisterForm";

const ResetPasswordForm = ({ onResetPassword }) => {
  const { token } = useParams();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = ({ password }) => {
    setIsSubmitting(true);
    callApi("/api/auth/reset-password", "POST", {
      password: password,
      token: token,
    }).then(({ status, ok, json }) => {
      let errors = [];
      if (status == 400) {
        if (json.detail == "RESET_PASSWORD_BAD_TOKEN") {
          errors.push({
            name: "password",
            errors: [
              <Localized
                key="bad-token"
                id="reset-password-form-error-bad-token"
                elems={{
                  forgotPasswordLink: <Link to="/forgot-password"></Link>,
                }}
              >
                <span></span>
              </Localized>,
            ],
          });
        } else if (json.detail.code == "RESET_PASSWORD_INVALID_PASSWORD") {
          let passwordError = json.detail.reason;
          if (passwordError.length == 0) {
            passwordError = [
              <Localized
                key="password-error"
                id="reset-password-form-password-error-stronger-password"
              />,
            ];
          }
          errors.push({
            name: "password",
            errors: passwordError,
          });
        }
      } else if (status == 422) {
        errors = getApiErrors(json);
      }

      if (_.isEmpty(errors) && !ok) {
        errors.push({
          name: "password",
          errors: [
            <Localized
              key="email-error"
              id="forgot-password-form-error-unknown"
            />,
          ],
        });
      }
      setIsSubmitting(false);
      if (_.isEmpty(errors)) {
        onResetPassword();
      } else {
        form.setFields(errors);
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
        label={<Localized id="reset-password-form-password-label" />}
        rules={[
          {
            required: true,
            message: (
              <Localized id="reset-password-form-password-error-required" />
            ),
          },
          {
            validateTrigger: "onSubmit",
            validator: passwordValidator(
              <Localized id="reset-password-form-password-error-stronger-password" />
            ),
          },
        ]}
        name="password"
      >
        <PasswordInput />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          <Localized id="reset-password-form-submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};

ResetPasswordForm.propTypes = {
  onResetPassword: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
