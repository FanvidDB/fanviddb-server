import submitForm from "./submitForm";

beforeEach(() => {
  fetch.resetMocks();
});

const abortError = {
  name: "field",
  errors: ["aborted"],
};

const unknownError = {
  name: "field",
  errors: ["unknown"],
};

describe("submitForm", () => {
  it("handles 500 errors", async () => {
    fetch.mockResponseOnce("Internal server error", { status: 500 });
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";

    await submitForm({
      url,
      values: {},
      setIsSubmitting,
      onSuccess,
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    expect(setErrors.mock.calls.length).toEqual(1);
    expect(setErrors.mock.calls[0][0]).toEqual([unknownError]);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });

  it("handles aborted requests", async () => {
    fetch.mockAbortOnce();
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";

    await submitForm({
      url,
      values: {},
      setIsSubmitting,
      onSuccess,
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    expect(setErrors.mock.calls.length).toEqual(1);
    expect(setErrors.mock.calls[0][0]).toEqual([abortError]);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });

  it("handles standard 422 errors", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        detail: [
          {
            loc: ["form", "path"],
            msg: "field is missing",
            type: "value_error.missing",
          },
        ],
      }),
      { status: 422 }
    );
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";

    await submitForm({
      url,
      values: {},
      setIsSubmitting,
      onSuccess,
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    expect(setErrors.mock.calls.length).toEqual(1);
    expect(setErrors.mock.calls[0][0].length).toEqual(1);
    expect(setErrors.mock.calls[0][0][0].name).toEqual(["path"]);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });

  it("allows path modification of standard 422 errors", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        detail: [
          {
            loc: ["form", "path"],
            msg: "field is missing",
            type: "value_error.missing",
          },
        ],
      }),
      { status: 422 }
    );
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";

    await submitForm({
      url,
      values: {},
      setIsSubmitting,
      onSuccess,
      modifyPath: (val) => [val[0], `other${val[1]}`],
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    expect(setErrors.mock.calls.length).toEqual(1);
    expect(setErrors.mock.calls[0][0].length).toEqual(1);
    expect(setErrors.mock.calls[0][0][0].name).toEqual(["otherpath"]);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });

  it("allows custom error handling", async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 400 });
    const customError = { name: "whatever", errors: ["this is a problem"] };
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";

    await submitForm({
      url,
      values: {},
      setIsSubmitting,
      onSuccess,
      getErrors: () => [customError],
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(0);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    expect(setErrors.mock.calls.length).toEqual(1);
    expect(setErrors.mock.calls[0][0].length).toEqual(1);
    expect(setErrors.mock.calls[0][0][0]).toEqual(customError);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });

  it("passes return values to onSuccess", async () => {
    const returnValues = { key: "value" };
    fetch.mockResponseOnce(JSON.stringify(returnValues), { status: 200 });
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";

    await submitForm({
      url,
      values: {},
      setIsSubmitting,
      onSuccess,
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(1);
    expect(onSuccess.mock.calls[0][0]).toEqual(returnValues);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    expect(setErrors.mock.calls.length).toEqual(0);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });

  it("allows PATCH requests", async () => {
    const returnValues = { key: "value" };
    fetch.mockResponseOnce(JSON.stringify(returnValues), { status: 200 });
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";
    const method = "PATCH";

    await submitForm({
      url,
      method,
      values: {},
      setIsSubmitting,
      onSuccess,
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(1);
    expect(onSuccess.mock.calls[0][0]).toEqual(returnValues);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method,
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    expect(setErrors.mock.calls.length).toEqual(0);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });

  it("allows json-encoded request data", async () => {
    const returnValues = { key: "value" };
    fetch.mockResponseOnce(JSON.stringify(returnValues), { status: 200 });
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";

    await submitForm({
      url,
      values: { foo: "bar" },
      setIsSubmitting,
      onSuccess,
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(1);
    expect(onSuccess.mock.calls[0][0]).toEqual(returnValues);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"foo":"bar"}',
    });
    expect(setErrors.mock.calls.length).toEqual(0);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });

  it("allows form-encoded requests", async () => {
    const returnValues = { key: "value" };
    fetch.mockResponseOnce(JSON.stringify(returnValues), { status: 200 });
    const onSuccess = jest.fn();
    const setIsSubmitting = jest.fn();
    const setErrors = jest.fn();
    const url = "http://google.com";
    const contentType = "application/x-www-form-urlencoded";

    await submitForm({
      url,
      contentType,
      values: { foo: "bar" },
      setIsSubmitting,
      onSuccess,
      abortError,
      unknownError,
      setErrors,
    });

    expect(onSuccess.mock.calls.length).toEqual(1);
    expect(onSuccess.mock.calls[0][0]).toEqual(returnValues);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ foo: "bar" }),
    });
    expect(setErrors.mock.calls.length).toEqual(0);
    expect(setIsSubmitting.mock.calls.length).toEqual(2);
    expect(setIsSubmitting.mock.calls[0][0]).toEqual(true);
    expect(setIsSubmitting.mock.calls[1][0]).toEqual(false);
  });
});
