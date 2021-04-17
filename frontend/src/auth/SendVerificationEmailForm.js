import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";
import PropTypes from "prop-types";
import { callApi } from "../api";

const SendVerificationEmailForm = ({
  initialEmail,
  onInitialSubmit,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [submitState, setSubmitState] = useState("loading");

  const onFinish = ({ email }) => {
    setSubmitState("submitting");
    callApi("/api/auth/request-verify-token", "POST", { email }).then(
      ({ ok }) => {
        if (ok) {
          onSubmit(email);
          setSubmitState();
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
          setSubmitState();
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
        setSubmitState();
      }
    );
  };

  useEffect(() => {
    if (initialEmail) {
      form.submit();
      onInitialSubmit();
    }
  }, []);

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
        <Button
          type="primary"
          htmlType="submit"
          loading={submitState == "submitting"}
        >
          <Localized id="send-verification-email-form-send-button" />
        </Button>
      </Form.Item>
    </Form>
  );
};

SendVerificationEmailForm.propTypes = {
  initialEmail: PropTypes.string,
  onInitialSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default SendVerificationEmailForm;
