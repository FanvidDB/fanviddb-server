import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider as FluentProvider } from "@fluent/react";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { l10n } from "../i18n/test";

beforeEach(() => {
  fetch.resetMocks();
});

describe("ForgotPasswordPage", () => {
  test("handles successful form submission", async () => {
    fetch.mockResponseOnce(JSON.stringify(null), { status: 200 });
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
    fetch.mockResponseOnce(
      JSON.stringify({
        detail: [
          {
            loc: ["body", "email"],
            msg: "field required",
            type: "value_error.missing",
          },
        ],
      }),
      { status: 422 }
    );
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
    fetch.mockResponseOnce(
      JSON.stringify({
        detail: [
          {
            loc: ["body", "email"],
            msg: "value is not a valid email address",
            type: "value_error.email",
          },
        ],
      }),
      { status: 422 }
    );
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
    fetch.mockResponseOnce(JSON.stringify(null), { status: 500 });
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
      "Unknown error occurred. Please try again in a few minutes."
    );
  });
});
