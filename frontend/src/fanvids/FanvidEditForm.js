import React, { useState } from "react";
import { Tag, Button, Form, Input, Select, Checkbox, Radio, Space } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Localized } from "@fluent/react";
import { callApi } from "../api";
import FormList from "../forms/FormList";
import { getApiErrors } from "../forms/apiErrors";
import DatePicker from "../forms/DatePicker";
import DurationPicker from "../forms/DurationPicker";
import UniqueIdentifierInput from "../forms/UniqueIdentifierInput";
import { contentNotes, ratings } from "./constants.js";
import _ from "lodash";
import PropTypes from "prop-types";

const urlRegex = /https?:\/\/.*\..*/;

const FanvidEditForm = ({ onFanvidSaved, fanvid }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onFinish = (values) => {
    setIsSuccess(false);
    setIsSubmitting(true);
    let url = "/api/fanvids";
    let method = "POST";
    if (fanvid.uuid) {
      url = "/api/fanvids/" + fanvid.uuid;
      method = "PATCH";
    }
    callApi(url, method, values).then(({ status, ok, json }) => {
      let errors = [];
      if (status == 422) {
        errors = getApiErrors(json, (path) => {
          if (path[1] == "unique_identifiers") {
            return path.slice(0, -1);
          }
          if (path[1] == "audio" && path[2] == "languages") {
            return path.slice(0, -1);
          }
          return path;
        });
      }
      if (!ok && _.isEmpty(errors)) {
        errors.title = [
          <Localized key="title-error" id="fanvid-form-error-unknown" />,
        ];
      }
      setIsSubmitting(false);
      if (_.isEmpty(errors)) {
        onFanvidSaved(json);
        setIsSuccess(true);
        setIsDirty(false);
      } else {
        form.setFields(errors);
      }
    });
  };
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      initialValues={fanvid}
      onFieldsChange={() => {
        setIsDirty(true);
      }}
    >
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
        <Select mode="tags" tokenSeparators={[","]} />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-audio-title-label" />}
        name={["audio", "title"]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-audio-artists-or-sources-label" />}
        name={["audio", "artists_or_sources"]}
      >
        <Select mode="tags" tokenSeparators={[","]} />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-audio-languages-label" />}
        name={["audio", "languages"]}
      >
        <Select mode="tags" tokenSeparators={[","]} />
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
        <DurationPicker />
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
        <Radio.Group
          options={Object.entries(ratings).map(([value, label]) => ({
            value,
            label,
          }))}
          optionType="button"
        />
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
        <Select mode="tags" tokenSeparators={[","]} />
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
        <Input.TextArea rows={4} autoSize />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-content-notes-label" />}
        name="content_notes"
        required
        rules={[
          {
            validator: (rule, value) =>
              value && !_.isEmpty(value)
                ? Promise.resolve()
                : Promise.reject([
                    <Localized
                      key="error"
                      id="fanvid-form-content-notes-error-required"
                    />,
                  ]),
          },
        ]}
      >
        <Checkbox.Group
          options={Object.entries(contentNotes).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </Form.Item>
      <FormList
        name="urls"
        label={<Localized id="fanvid-form-urls-label" />}
        defaultValue=""
        inputComponent={<Input type="url" placeholder="https://" />}
        rules={[
          {
            validator: (_, value) =>
              urlRegex.test(value)
                ? Promise.resolve()
                : Promise.reject([
                    <Localized
                      key="error"
                      id="fanvid-form-urls-error-invalid-url"
                    />,
                  ]),
          },
        ]}
      />
      <FormList
        name="unique_identifiers"
        label={<Localized id="fanvid-form-unique-identifiers-label" />}
        inputComponent={<UniqueIdentifierInput />}
        defaultValue={{ kind: "filename" }}
      />
      <Form.Item
        label={<Localized id="fanvid-form-thumbnail-url-label" />}
        name="thumbnail_url"
        rules={[
          {
            validator: (_, value) =>
              urlRegex.test(value)
                ? Promise.resolve()
                : Promise.reject([
                    <Localized
                      key="error"
                      id="fanvid-form-thumbnail-url-error-invalid-url"
                    />,
                  ]),
          },
        ]}
      >
        <Input type="url" placeholder="https://" />
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
      <Space>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!isDirty}
        >
          <Localized id="fanvid-form-save-button" />
        </Button>
        {isSuccess && !isDirty && (
          <Tag icon={<CheckCircleOutlined />} color="success">
            <Localized id="fanvid-form-save-success" />
          </Tag>
        )}
        {!isSuccess && !isDirty && (
          <Tag color="default">
            <Localized id="fanvid-form-save-no-changes" />
          </Tag>
        )}
      </Space>
    </Form>
  );
};

FanvidEditForm.propTypes = {
  onFanvidSaved: PropTypes.func.isRequired,
  fanvid: PropTypes.object,
};

export default FanvidEditForm;
