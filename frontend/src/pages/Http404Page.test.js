import React from "react";
import TestRenderer from "react-test-renderer";
import {
  LocalizationProvider as FluentProvider,
} from "@fluent/react";


import Http404Page from "./Http404Page";
import { l10n } from "../i18n/test";

test("renders", () => {
  TestRenderer.create(
      <FluentProvider l10n={l10n}>
        <Http404Page />
      </FluentProvider>
    );
});
