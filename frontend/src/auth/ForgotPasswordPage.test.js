import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider as FluentProvider } from "@fluent/react";

jest.mock("../api", () => {
  return {
    callApi: jest.fn(),
  };
});

import { callApi } from "../api";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { l10n } from "../i18n/test";

beforeEach(() => {
  callApi.mockClear();
});

describe("ForgotPasswordPage", () => {
  test("handles successful form submission", async () => {
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({ ok: true, status: 200, json: null });
    });
    const user = userEvent.setup();
    render(
      <FluentProvider l10n={l10n}>
        <ForgotPasswordPage />
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("Email"), "whatever@fanviddb.com");
    await user.click(
      screen.getByRole("button", {
        name: "Request password reset",
      })
    );

    await waitFor(() => {
      const submitButton = screen.queryByRole("button", {
        name: "Request password reset",
      });
      expect(submitButton).toBeNull();
    });
  });

  test("handles api validation errors", async () => {
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 422,
        json: {
          detail: [
            {
              loc: ["body", "email"],
              msg: "field required",
              type: "value_error.missing",
            },
          ],
        },
      });
    });
    const user = userEvent.setup();
    render(
      <FluentProvider l10n={l10n}>
        <ForgotPasswordPage />
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("Email"), "whatever@fanviddb.com");
    await user.click(
      screen.getByRole("button", {
        name: "Request password reset",
      })
    );

    const submitButton = await screen.findByRole("button", {
      name: "Request password reset",
    });
    expect(submitButton).not.toBeDisabled();
    await screen.findByText("This field is required.");
  });

  test("handles invalid email error", async () => {
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 422,
        json: {
          detail: [
            {
              loc: ["body", "email"],
              msg: "value is not a valid email address",
              type: "value_error.email",
            },
          ],
        },
      });
    });
    const user = userEvent.setup();
    render(
      <FluentProvider l10n={l10n}>
        <ForgotPasswordPage />
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("Email"), "whatever@fanviddb.com");
    await user.click(
      screen.getByRole("button", {
        name: "Request password reset",
      })
    );

    const submitButton = await screen.findByRole("button", {
      name: "Request password reset",
    });
    expect(submitButton).not.toBeDisabled();
    await screen.findByText("Invalid email address.");
  });

  test("handles unknown error", async () => {
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: null,
      });
    });
    const user = userEvent.setup();
    render(
      <FluentProvider l10n={l10n}>
        <ForgotPasswordPage />
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("Email"), "whatever@fanviddb.com");
    await user.click(
      screen.getByRole("button", {
        name: "Request password reset",
      })
    );

    const submitButton = await screen.findByRole("button", {
      name: "Request password reset",
    });
    expect(submitButton).not.toBeDisabled();
    await screen.findByText(
      "Unknown error occurred, please try again in a few minutes"
    );
  });
});
