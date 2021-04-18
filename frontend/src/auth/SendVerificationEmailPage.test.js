import React from "react";
import TestRenderer from "react-test-renderer";
import SendVerificationEmailPage from "./SendVerificationEmailPage";
import { MemoryRouter } from "react-router-dom";

test("renders without email in location state", () => {
  TestRenderer.create(
    <MemoryRouter>
      <SendVerificationEmailPage />
    </MemoryRouter>
  );
});

test("renders with email in location state", () => {
  TestRenderer.create(
    <MemoryRouter
      initialEntries={[
        { pathname: "/", state: { sendToEmail: "hello@fanviddb.com" } },
      ]}
    >
      <SendVerificationEmailPage />
    </MemoryRouter>
  );
});
