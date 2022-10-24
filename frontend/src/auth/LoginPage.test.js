import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import {
  LocalizationProvider as FluentProvider,
} from "@fluent/react";

jest.mock("../api", () => {
  return {
    callApi: jest.fn(),
  };
});

import { callApi } from "../api";
import LoginPage from "./LoginPage";
import AuthContext from "./authContext";
import { l10n } from "../i18n/test";

beforeEach(() => {
  callApi.mockClear();
});

describe("LoginPage", () => {
  test("redirects to home after login", async () => {
    const expected = "Home";
    callApi.mockImplementationOnce(() => {
      return Promise.resolve({ ok: true, status: 200, json: null });
    });
    const loadUserData = jest.fn();
    const { getByLabelText, getByRole, findByTestId } = render(
      <FluentProvider l10n={l10n}>
        <AuthContext.Provider value={{ loadUserData }}>
          <MemoryRouter initialEntries={["/login"]}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={<div data-testid="output">{expected}</div>}
              />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      </FluentProvider>
    );
    const email = getByLabelText("Email");
    const password = getByLabelText("Password");
    fireEvent.change(email, { target: { value: "whatever@fanviddb.com" } });
    fireEvent.change(password, { target: { value: "suibian" } });
    const submitButton = getByRole("button", {
      name: "Log in",
    });
    fireEvent.submit(submitButton);

    const output = await findByTestId("output");
    expect(output).toHaveTextContent(expected);
  });
});
