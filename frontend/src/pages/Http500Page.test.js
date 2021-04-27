import React from "react";
import TestRenderer from "react-test-renderer";
import Http500Page from "./Http500Page";

test("renders", () => {
  TestRenderer.create(<Http500Page />);
});
