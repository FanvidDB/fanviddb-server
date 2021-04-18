import React from "react";
import TestRenderer from "react-test-renderer";
import SendVerificationEmailPage from "./SendVerificationEmailPage";
import { MemoryRouter } from "react-router-dom";
import { Form } from "antd";

test("has no initial email if not in location", () => {
  const testRenderer = TestRenderer.create(
    <MemoryRouter>
      <SendVerificationEmailPage />
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
      <SendVerificationEmailPage />
    </MemoryRouter>
  );
  const form = testRenderer.root.findByType(Form);
  expect(form.props.initialValues.email).toBe(email);
});
