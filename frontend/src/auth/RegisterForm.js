import React from "react";
import { Button, Form, Input } from "antd";
import { Localized } from "@fluent/react";
import LoadablePasswordStrengthBar from "./LoadablePasswordStrengthBar";

const RegisterForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((response) => {
        return new Promise((resolve) =>
          response.json().then((json) =>
            resolve({
              status: response.status,
              ok: response.ok,
              json,
            })
          )
        );
      })
      .then(({ status, ok, json }) => {
        if (status == 400) {
          if (json.detail == "REGISTER_USERNAME_ALREADY_EXISTS") {
            form.setFields([
              {
                name: "username",
                errors: [
                  <Localized
                    key="username-error"
                    id="register-form-username-error-already-exists"
                  />,
                ],
              },
            ]);
          } else {
            form.setFields([
              {
                name: "email",
                errors: [
                  <Localized
                    key="email-error"
                    id="register-form-email-error-already-exists"
                  />,
                ],
              },
            ]);
          }
        } else if (!ok) {
          form.setFields([
            {
              name: "username",
              errors: [
                <Localized
                  key="email-error"
                  id="register-form-username-error-unknown"
                />,
              ],
            },
          ]);
        }
      })
      .catch((error) => console.error("Error:", error));
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
        ]}
        name="password"
      >
        <div>
          <Form.Item noStyle name="password">
            <Input.Password suffix={"hi"} />
          </Form.Item>
          <Form.Item noStyle name="password" valuePropName="password">
            <LoadablePasswordStrengthBar />
          </Form.Item>
        </div>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
        <Button type="primary" htmlType="submit">
          <Localized id="register-form-register-button" />
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
