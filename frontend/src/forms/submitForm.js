import { getApiErrors } from "./apiErrors";
import _ from "lodash";

export default async function submitForm({
  url,
  method = "POST",
  values,
  contentType = "application/json",
  setIsSubmitting,
  onSuccess = () => {},
  modifyPath = (val) => val,
  getErrors = () => [],
  abortError,
  unknownError,
  setErrors,
}: {
  url: string,
  method?: string,
  values: {},
  contentType?: string,
  setIsSubmitting: () => any,
  onSuccess?: () => any,
  modifyPath?: () => any,
  getErrors: (status: number, json: {}) => [],
  abortError: { name: string, errors: [] },
  unknownError: { name: string, errors: [] },
  setErrors: ([{ name: string, errors: [] }]) => any,
}) {
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
    throw new Error(`Unhandled Content-Type: ${contentType}`);
  }

  let response;
  try {
    response = await fetch(url, fetchOpts);
  } catch {
    // Aborted response
    setIsSubmitting(false);
    setErrors([abortError]);
    return;
  }

  // 500 errors don't give useful information.
  const text = await response.text();
  if (response.status == 500) {
    console.error("Error:", text);
    setIsSubmitting(false);
    setErrors([unknownError]);
    return;
  }

  // Unparseable JSON doesn't give useful information.
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("Couldn't parse response json:", text);
    setIsSubmitting(false);
    setErrors([unknownError]);
    return;
  }

  if (response.ok) {
    onSuccess(json);
    setIsSubmitting(false);
    return;
  }

  let errors = [];

  errors.push(...getErrors(response.status, json));

  if (response.status == 422) {
    errors.push(...getApiErrors(json, modifyPath));
  }

  // We know there's an error but couldn't figure it out for some reason.
  if (_.isEmpty(errors) && !response.ok) {
    errors.push(unknownError);
  }

  setErrors(errors);
  setIsSubmitting(false);
}
