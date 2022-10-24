import React from "react";
import TestRenderer from "react-test-renderer";
import { LocalizationProvider as FluentProvider } from "@fluent/react";
import { MemoryRouter } from "react-router-dom";
import { Form } from "antd";

import SendVerificationEmailPage from "./SendVerificationEmailPage";
import { l10n } from "../i18n/test";

test("has no initial email if not in location", () => {
  const testRenderer = TestRenderer.create(
    <MemoryRouter>
      <FluentProvider l10n={l10n}>
        <SendVerificationEmailPage />
      </FluentProvider>
    </MemoryRouter>
  );
  const form = testRenderer.root.findByType(Form);
  expect(form.props.initialValues.email).toBe(null);
});

test("renders with email in location state", () => {
  const email = "hello@fanviddb.com";
  const testRenderer = TestRenderer.create(
    <MemoryRouter
      initialEntries={[
        { pathname: "/", search: `?email=${encodeURIComponent(email)}` },
      ]}
    >
      <FluentProvider l10n={l10n}>
        <SendVerificationEmailPage />
      </FluentProvider>
    </MemoryRouter>
  );
  const form = testRenderer.root.findByType(Form);
  expect(form.props.initialValues.email).toBe(email);
});
