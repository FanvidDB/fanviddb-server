import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Checkbox,
  Radio,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      initialValues={fanvid}
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
        <Select mode="tags" tokenSeparators={[",", " "]} />
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
        <Select mode="tags" tokenSeparators={[",", " "]} />
      </Form.Item>
      <Form.Item
        label={<Localized id="fanvid-form-audio-language-label" />}
        name={["audio", "language"]}
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
        <Radio.Group
          options={[
            { value: "gen", label: <Localized id="rating-gen" /> },
            { value: "teen", label: <Localized id="rating-teen" /> },
            { value: "mature", label: <Localized id="rating-mature" /> },
            { value: "explicit", label: <Localized id="rating-explicit" /> },
          ]}
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
        <Select mode="tags" tokenSeparators={[",", " "]} />
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
      >
        <Checkbox.Group
          options={[
            {
              value: "graphic-violence",
              label: <Localized id="content-notes-graphic-violence" />,
            },
            {
              value: "major-character-death",
              label: <Localized id="content-notes-major-character-death" />,
            },
            {
              value: "no-warnings-apply",
              label: <Localized id="content-notes-no-warnings-apply" />,
            },
            {
              value: "rape-or-non-con",
              label: <Localized id="content-notes-rape-or-non-con" />,
            },
            {
              value: "underage",
              label: <Localized id="content-notes-underage" />,
            },
            {
              value: "physical-triggers",
              label: <Localized id="content-notes-physical-triggers" />,
            },
            {
              value: "animal-harm",
              label: <Localized id="content-notes-animal-harm" />,
            },
            {
              value: "auditory-triggers",
              label: <Localized id="content-notes-auditory-triggers" />,
            },
            {
              value: "blackface-or-brownface-or-redface",
              label: (
                <Localized id="content-notes-blackface-or-brownface-or-redface" />
              ),
            },
            {
              value: "significant-blood-or-gore",
              label: <Localized id="content-notes-significant-blood-or-gore" />,
            },
            {
              value: "depictions-of-police",
              label: <Localized id="content-notes-depictions-of-police" />,
            },
            {
              value: "holocaust-or-nazi-imagery",
              label: <Localized id="content-notes-holocaust-or-nazi-imagery" />,
            },
            { value: "incest", label: <Localized id="content-notes-incest" /> },
            {
              value: "queerphobia",
              label: <Localized id="content-notes-queerphobia" />,
            },
            { value: "racism", label: <Localized id="content-notes-racism" /> },
            {
              value: "self-harm",
              label: <Localized id="content-notes-self-harm" />,
            },
            {
              value: "suicide",
              label: <Localized id="content-notes-suicide" />,
            },
            {
              value: "transphobia",
              label: <Localized id="content-notes-transphobia" />,
            },
          ]}
        />
      </Form.Item>
      <Form.List name="urls">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                required={false}
                label={index == 0 && <Localized id="fanvid-form-urls-label" />}
                key={field.key}
              >
                <Form.Item {...field} key={field.key} noStyle>
                  <Input style={{ width: "60%" }} />
                </Form.Item>
                {fields.length > 1 && (
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                )}
              </Form.Item>
            ))}
            <Form.Item>
              <Button onClick={() => add()} icon={<PlusOutlined />}>
                Add
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.List name="unique_identifiers">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                required={false}
                label={
                  index == 0 && (
                    <Localized id="fanvid-form-unique-identifiers-label" />
                  )
                }
                key={field.key}
              >
                <Form.Item {...field} key={field.key} noStyle>
                  <Input style={{ width: "60%" }} />
                </Form.Item>
                {fields.length > 1 && (
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                )}
              </Form.Item>
            ))}
            <Form.Item>
              <Button onClick={() => add()} icon={<PlusOutlined />}>
                Add
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
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
