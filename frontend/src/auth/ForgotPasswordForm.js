import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";
import PropTypes from "prop-types";
import submitForm from "../forms/submitForm";

const ForgotPasswordForm = ({ onForgotPassword }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = ({ email }) => {
    submitForm({
      form,
      setIsSubmitting,
      defaultErrorField: "email",
      url: "/api/auth/forgot-password",
      values: { email },
      onSuccess: onForgotPassword,
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
            message: (
              <Localized id="forgot-password-form-email-error-required" />
            ),
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
