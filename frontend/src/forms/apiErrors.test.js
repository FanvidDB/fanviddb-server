import { getApiErrors } from "./apiErrors";
import { Localized } from "@fluent/react";

test("handles an empty object gracefully", () => {
  const apiJson = {};
  const errors = getApiErrors(apiJson);
  expect(errors).toHaveLength(0);
});

test("handles empty error details gracefully", () => {
  const apiJson = { detail: [] };
  const errors = getApiErrors(apiJson);
  expect(errors).toHaveLength(0);
});

test("extracts and localizes errors from error details", () => {
  const apiJson = {
    detail: [
      {
        loc: ["body", "thumbnail_url"],
        msg: "URL host invalid, top level domain required",
        type: "value_error.url.host",
      },
    ],
  };
  const errors = getApiErrors(apiJson);
  expect(errors).toHaveLength(1);
  expect(errors[0].name).toEqual(["thumbnail_url"]);
  expect(errors[0].errors).toHaveLength(1);

  const localizedComponent = errors[0].errors[0];
  expect(localizedComponent.type).toBe(Localized);
  expect(localizedComponent.props.id).toBe("form-error-url-host");
  expect(localizedComponent.props.vars).toBeUndefined();
});

test("allows callback to modify paths", () => {
  const apiJson = {
    detail: [
      {
        loc: ["body", "unique_identifiers", 0, "identifier"],
        msg: "ensure this value has at least 1 characters",
        type: "value_error.any_str.min_length",
        ctx: {
          limit_value: 1,
        },
      },
    ],
  };
  const errors = getApiErrors(apiJson, (path) => {
    if (path[1] == "unique_identifiers") {
      return path.slice(0, -1);
    }
    return path;
  });
  expect(errors).toHaveLength(1);
  expect(errors[0].name).toEqual(["unique_identifiers", 0]);
  expect(errors[0].errors).toHaveLength(1);

  const localizedComponent = errors[0].errors[0];
  expect(localizedComponent.type).toBe(Localized);
  expect(localizedComponent.props.id).toBe("form-error-string-min-length");
  expect(localizedComponent.props.vars).toEqual({ limit_value: 1 });
});
