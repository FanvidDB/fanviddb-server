import React from "react";
import { FormInstance } from "antd";
import { Localized } from "@fluent/react";
import { getApiErrors } from "./apiErrors";
import _ from "lodash";

const noop = () => {};

export default async function submitForm({
  url,
  method = "POST",
  values,
  contentType = "application/json",
  form,
  setIsSubmitting,
  onSuccess = noop,
  getErrors = () => [],
  defaultErrorField,
  modifyPath = (val) => val,
}: {
  url: string,
  method?: string,
  values: {},
  contentType?: string,
  form: FormInstance,
  setIsSubmitting: () => any,
  onSuccess?: () => any,
  getErrors: (status: number, json: {}) => [],
  defaultErrorField: string,
}): { status: string, ok: boolean, json: null | {}, text: null | string } {
  setIsSubmitting(true);
  const fetchOpts = {
    method,
    headers: {
      "Content-Type": contentType,
    },
  };
  if (contentType == "application/json") {
    fetchOpts.body = JSON.stringify(values);
  } else if (contentType == "application/x-www-form-urlencoded") {
    fetchOpts.body = new URLSearchParams(values);
  } else {
    fetchOpts.body = values;
  }

  let response;
  try {
    response = await fetch(url, fetchOpts);
  } catch {
    // Aborted response
    setIsSubmitting(false);
    form.setFields([
      {
        name: defaultErrorField,
        errors: [<Localized key="aborted-error" id="form-error-aborted" />],
      },
    ]);
    return;
  }

  // 500 errors don't give useful information.
  const text = await response.text();
  if (response.status == 500) {
    console.error("Error:", text);
    setIsSubmitting(false);
    form.setFields([
      {
        name: defaultErrorField,
        errors: [<Localized key="unknown-error" id="form-error-unknown" />],
      },
    ]);
    return;
  }

  // Unparseable JSON doesn't give useful information.
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("Couldn't parse response json:", text);
    setIsSubmitting(false);
    form.setFields([
      {
        name: defaultErrorField,
        errors: [<Localized key="unknown-error" id="form-error-unknown" />],
      },
    ]);
    return;
  }

  if (response.ok) {
    onSuccess(json);
    setIsSubmitting(false);
    return;
  }

  let errors = [];

  errors.push(...getErrors(json));

  if (response.status == 422) {
    errors.push(...getApiErrors(json, modifyPath));
  }

  // We know there's an error but couldn't figure it out for some reason.
  if (_.isEmpty(errors) && !response.ok) {
    errors.push({
      name: defaultErrorField,
      errors: [<Localized key="unknown-error" id="form-error-unknown" />],
    });
  }

  form.setFields(errors);
}
