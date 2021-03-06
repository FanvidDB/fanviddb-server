import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";
import PropTypes from "prop-types";
import { callApi } from "../api";

const SendVerificationEmailForm = ({ initialEmail, onSubmit }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = ({ email }) => {
    setIsSubmitting(true);
    callApi("/api/auth/request-verify-token", "POST", { email }).then(
      ({ ok }) => {
        if (ok) {
          onSubmit(email);
          setIsSubmitting(false);
        } else {
          form.setFields([
            {
              name: "email",
              errors: [
                <Localized
                  key="email-error"
                  id="send-verification-email-form-email-error-unknown"
                />,
              ],
            },
          ]);
          setIsSubmitting(false);
        }
      },
      () => {
        form.setFields([
          {
            name: "email",
            errors: [
              <Localized
                key="email-error"
                id="send-verification-email-form-email-error-unknown"
              />,
            ],
          },
        ]);
        setIsSubmitting(false);
      }
    );
  };

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      colon={false}
      onFinish={onFinish}
      form={form}
      initialValues={{
        email: initialEmail,
      }}
    >
      <Form.Item
        label={<Localized id="send-verification-email-form-email-label" />}
        name="email"
        type="email"
        rules={[
          {
            required: true,
            message: (
              <Localized id="send-verification-email-form-email-error-required" />
            ),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          <Localized id="send-verification-email-form-send-button" />
        </Button>
      </Form.Item>
    </Form>
  );
};

SendVerificationEmailForm.propTypes = {
  initialEmail: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default SendVerificationEmailForm;
