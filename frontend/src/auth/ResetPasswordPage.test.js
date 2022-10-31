import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider as FluentProvider } from "@fluent/react";

jest.mock("../api", () => {
  return {
    callApi: jest.fn(),
  };
});

import { callApi } from "../api";
import ResetPasswordPage from "./ResetPasswordPage";
import { l10n } from "../i18n/test";

beforeEach(() => {
  callApi.mockClear();
});

const testPassword =
  "this-is-a-test-password-do-not-use-correct-battery-horse-staple";

describe("ResetPasswordPage", () => {
  test("handles successful form submission", async () => {
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({ ok: true, status: 200, json: null });
    });
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
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 422,
        json: {
          detail: [
            {
              loc: ["body", "password"],
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
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 400,
        json: {
          detail: "RESET_PASSWORD_BAD_TOKEN",
        },
      });
    });
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
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        status: 400,
        json: {
          detail: {
            code: "RESET_PASSWORD_INVALID_PASSWORD",
            reason: [],
          },
        },
      });
    });
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
      "Unknown error occurred, please try again in a few minutes"
    );
  });
});
