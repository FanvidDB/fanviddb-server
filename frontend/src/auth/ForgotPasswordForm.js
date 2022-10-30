import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";
import _ from "lodash";
import { callApi } from "../api";
import { getApiErrors } from "../forms/apiErrors";
import PropTypes from "prop-types";

const ForgotPasswordForm = ({ onForgotPassword }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = ({ email }) => {
    callApi(
      "/api/auth/forgot-password",
      "POST",
      { email: email }
    ).then(({ status, ok, json }) => {
      let errors = {};
      if (status == 422) {
        errors = getApiErrors(json);
      }

      if (_.isEmpty(errors) && !ok) {
        errors.email = [
          <Localized key="email-error" id="forgot-password-form-error-unknown" />,
        ];
      }
      setIsSubmitting(false);
      if (_.isEmpty(errors)) {
        onForgotPassword();
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
        label={<Localized id="forgot-password-form-email-label" />}
        name="email"
        rules={[
          {
            required: true,
            message: <Localized id="forgot-password-form-email-error-required" />,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          <Localized id="forgot-password-form-submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};

ForgotPasswordForm.propTypes = {
  onForgotPassword: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
