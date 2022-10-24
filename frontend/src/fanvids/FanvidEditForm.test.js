import React from "react";
import { render } from "@testing-library/react";
import FanvidEditForm from "./FanvidEditForm";
import { LocalizationProvider as FluentProvider } from "@fluent/react";

import { l10n } from "../i18n/test";

describe("FanvidEditForm", () => {
  test("renders with fanvid data", () => {
    const fanvid = {
      title: "string",
      creators: ["string"],
      premiere_date: "2021-03-14",
      premiere_event: "string",
      audio: {
        title: "string",
        artists_or_sources: ["string"],
        languages: ["en-US"],
      },
      length: 0,
      rating: "gen",
      fandoms: [],
      summary: "string",
      content_notes: ["no-warnings-apply"],
      urls: [],
      unique_identifiers: [],
      thumbnail_url: "https://example.com",
      state: "string",
      uuid: "6cae95e5-bff4-4342-b9ab-aaacd63c1265",
      created_timestamp: "2021-03-15T03:11:37.875202",
      modified_timestamp: "2021-03-15T03:11:37.875205",
    };
    render(
      <FluentProvider l10n={l10n}>
        <FanvidEditForm fanvid={fanvid} onFanvidSaved={() => {}} />
      </FluentProvider>
    );
  });
});
