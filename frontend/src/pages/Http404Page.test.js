import React from "react";
import TestRenderer from "react-test-renderer";
import Http404Page from "./Http404Page";

test("renders", () => {
  TestRenderer.create(<Http404Page />);
});
