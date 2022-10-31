import React from "react";
import { Localized } from "@fluent/react";

// Utilities for converting api errors into localized form errors.

// Automatically converts errors from FastAPI into localized errors
// that can be used in form.setFields().
export const getApiErrors = (json, modifyPath = (val) => val) => {
  let errors = [];

  if (json.detail) {
    for (const { loc, ctx, type } of json.detail) {
      const name = modifyPath(loc).slice(1);
      errors.push({ name, errors: [localizeApiError(type, ctx)] });
    }
  }
  return errors;
};

export const localizeApiError = (errorType, errorContext) => {
  if (Object.prototype.hasOwnProperty.call(apiErrors, errorType)) {
    return <Localized id={apiErrors[errorType]} vars={errorContext} />;
  }
  console.warn("API error not found", errorType, errorContext);
  return defaultError;
};

const defaultError = <Localized id="form-error-unknown" />;
const apiErrors = {
  "value_error.any_str.min_length": "form-error-string-min-length",
  "value_error.url.host": "form-error-url-host",
  "value_error.missing": "form-error-missing",
  "value_error.email": "form-error-email",
};
