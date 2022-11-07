import React, { useState } from "react";
import { Tag, Button, Form, Input, Select, Checkbox, Radio, Space } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Localized } from "@fluent/react";
import FormList from "../forms/FormList";
import DatePicker from "../forms/DatePicker";
import DurationPicker from "../forms/DurationPicker";
import UniqueIdentifierInput from "../forms/UniqueIdentifierInput";
import { contentNotes, ratings, languages } from "./constants.js";
import _ from "lodash";
import PropTypes from "prop-types";
import submitForm from "../forms/submitForm";

const urlRegex = /https?:\/\/.*\..*/;

const { Option } = Select;

const FanvidEditForm = ({ onFanvidSaved, fanvid }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onFinish = (values) => {
    setIsSuccess(false);
    let url = "/api/fanvids";
    let method = "POST";
    if (fanvid.uuid) {
      url = "/api/fanvids/" + fanvid.uuid;
      method = "PATCH";
    }
    submitForm({
      setIsSubmitting,
      url,
      method,
      values,
      onSuccess: (json) => {
        onFanvidSaved(json);
        setIsSuccess(true);
        setIsDirty(false);
      },
      modifyPath: (path) => {
        if (path[1] == "unique_identifiers") {
          return path.slice(0, -1);
        }
        if (path[1] == "audio" && path[2] == "languages") {
          return path.slice(0, -1);
        }
        return path;
      },
      abortError: {
        name: "title",
        errors: [<Localized key="aborted-error" id="form-error-aborted" />],
      },
      unknownError: {
        name: "title",
        errors: [<Localized key="unknown-error" id="form-error-unknown" />],
      },
      setErrors: form.setFields,
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
        help={<Localized id="fanvid-form-audio-languages-help" />}
      >
        <Select mode="tags" tokenSeparators={[","]} allowClear>
          {Object.entries(languages).map(([value, localized]) => (
            <Option key={value} value={value}>
              {localized}
            </Option>
          ))}
        </Select>
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
