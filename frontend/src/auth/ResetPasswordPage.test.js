import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider as FluentProvider } from "@fluent/react";
import ResetPasswordPage from "./ResetPasswordPage";
import { l10n } from "../i18n/test";

beforeEach(() => {
  fetch.resetMocks();
});

const testPassword =
  "this-is-a-test-password-do-not-use-correct-battery-horse-staple";

describe("ResetPasswordPage", () => {
  test("handles successful form submission", async () => {
    fetch.mockResponseOnce(JSON.stringify(null), { status: 200 });
    const user = userEvent.setup();
    render(
      <FluentProvider l10n={l10n}>
        <MemoryRouter initialEntries={["/reset-password/token-12345"]}>
          <Routes>
            <Route
              path="/reset-password/token-12345"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </MemoryRouter>
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("New Password"), testPassword);
    await user.click(
      screen.getByRole("button", {
        name: "Reset Password",
      })
    );

    await waitFor(() => {
      const submitButton = screen.queryByRole("button", {
        name: "Reset Password",
      });
      expect(submitButton).toBeNull();
    });
    await screen.findByText(/^Password reset successful/);
  });

  test("handles api validation errors", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        detail: [
          {
            loc: ["body", "password"],
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
        <MemoryRouter initialEntries={["/reset-password/token-12345"]}>
          <Routes>
            <Route
              path="/reset-password/token-12345"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </MemoryRouter>
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("New Password"), testPassword);
    await user.click(
      screen.getByRole("button", {
        name: "Reset Password",
      })
    );

    const submitButton = await screen.findByRole("button", {
      name: "Reset Password",
    });
    expect(submitButton).not.toBeDisabled();
    await screen.findByText("This field is required.");
  });

  test("handles bad token error", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        detail: "RESET_PASSWORD_BAD_TOKEN",
      }),
      { status: 400 }
    );
    const user = userEvent.setup();
    render(
      <FluentProvider l10n={l10n}>
        <MemoryRouter initialEntries={["/reset-password/token-12345"]}>
          <Routes>
            <Route
              path="/reset-password/token-12345"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </MemoryRouter>
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("New Password"), testPassword);
    await user.click(
      screen.getByRole("button", {
        name: "Reset Password",
      })
    );

    const submitButton = await screen.findByRole("button", {
      name: "Reset Password",
    });
    expect(submitButton).not.toBeDisabled();
    await screen.findByText(/^Password reset link is invalid or expired/);
  });

  test("handles invalid password error", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        detail: {
          code: "RESET_PASSWORD_INVALID_PASSWORD",
          reason: [],
        },
      }),
      { status: 400 }
    );
    const user = userEvent.setup();
    render(
      <FluentProvider l10n={l10n}>
        <MemoryRouter initialEntries={["/reset-password/token-12345"]}>
          <Routes>
            <Route
              path="/reset-password/token-12345"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </MemoryRouter>
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("New Password"), testPassword);
    await user.click(
      screen.getByRole("button", {
        name: "Reset Password",
      })
    );

    const submitButton = await screen.findByRole("button", {
      name: "Reset Password",
    });
    expect(submitButton).not.toBeDisabled();
    await screen.findByText("Please choose a stronger password.");
  });

  test("handles unknown error", async () => {
    fetch.mockResponseOnce(JSON.stringify(null), { status: 500 });
    const user = userEvent.setup();
    render(
      <FluentProvider l10n={l10n}>
        <MemoryRouter initialEntries={["/reset-password/token-12345"]}>
          <Routes>
            <Route
              path="/reset-password/token-12345"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </MemoryRouter>
      </FluentProvider>
    );

    await user.type(screen.getByLabelText("New Password"), testPassword);
    await user.click(
      screen.getByRole("button", {
        name: "Reset Password",
      })
    );

    const submitButton = await screen.findByRole("button", {
      name: "Reset Password",
    });
    expect(submitButton).not.toBeDisabled();
    await screen.findByText(
      "Unknown error occurred. Please try again in a few minutes."
    );
  });
});
