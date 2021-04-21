import React, { useState } from "react";
import { Button, Form, Input, InputNumber, DatePicker } from "antd";
import { Localized } from "@fluent/react";
import { callApi } from "../api";
import _ from "lodash";
import PropTypes from "prop-types";

const FanvidEditForm = ({ onFanvidSaved, fanvid }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = (values) => {
    let url = "/api/fanvids";
    let method = "POST";
    if (fanvid.uuid) {
      url = "/api/fanvids/" + fanvid.uuid;
      method = "PATCH";
    }
    callApi(url, method, values).then(({ ok, json }) => {
      let errors = {};
      if (!ok) {
        errors.title = [
          <Localized key="title-error" id="fanvid-form-error-unknown" />,
        ];
      }
      setIsSubmitting(false);
      if (_.isEmpty(errors)) {
        onFanvidSaved(json);
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
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Form.Item
        label={<Localized id="fanvid-form-title-label" />}
        name="title"
        rules={[
          {
            required: true,
            message: <Localized id="fanvid-form-title-error-required" />,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-creators-label" />}
        name="creators"
        rules={[
          {
            required: true,
            message: <Localized id="fanvid-form-creators-error-required" />,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-audio-label" />}
        name="audio"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-length-label" />}
        name="length"
        rules={[
          {
            required: true,
            message: <Localized id="fanvid-form-length-error-required" />,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-rating-label" />}
        name="rating"
        rules={[
          {
            required: true,
            message: <Localized id="fanvid-form-rating-error-required" />,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-fandoms-label" />}
        name="fandoms"
        rules={[
          {
            required: true,
            message: <Localized id="fanvid-form-fandoms-error-required" />,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-summary-label" />}
        name="summary"
        rules={[
          {
            required: true,
            message: <Localized id="fanvid-form-summary-error-required" />,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-content-notes-label" />}
        name="content_notes"
      >
        <Input />
      </Form.Item>
      <Form.Item label={<Localized id="fanvid-form-urls-label" />} name="urls">
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-unique-identifiers-label" />}
        name="unique_identifiers"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-thumbnail-url-label" />}
        name="thumbnail_url"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-premiere-date-label" />}
        name="premiere_date"
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-premiere-event-label" />}
        name="premiere_event"
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isSubmitting}>
        <Localized id="fanvid-form-save-button" />
      </Button>
    </Form>
  );
};

FanvidEditForm.propTypes = {
  onFanvidSaved: PropTypes.func.isRequired,
  fanvid: PropTypes.shape,
};

export default FanvidEditForm;
