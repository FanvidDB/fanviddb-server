import React from "react";
import { Localized } from "@fluent/react";

// Utilities for converting api errors into localized form errors.

const defaultError = <Localized id="form-error-unknown" />;

export const getError = (errorType, errorContext) => {
  if (Object.prototype.hasOwnProperty.call(apiErrors, errorType)) {
    return <Localized id={apiErrors[errorType]} vars={errorContext} />;
  }
  console.error("API error not found", errorType, errorContext);
  return defaultError;
};

const apiErrors = {
  "value_error.any_str.min_length": "form-error-string-min-length",
};
