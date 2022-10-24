import fs from "fs";

import { FluentBundle, FluentResource } from "@fluent/bundle";
import { ReactLocalization } from "@fluent/react";

const bundle = new FluentBundle("en-US");
const enUS = fs.readFileSync("locale/en-US/react.ftl").toString();
bundle.addResource(new FluentResource(enUS));
export const l10n = new ReactLocalization([bundle]);
