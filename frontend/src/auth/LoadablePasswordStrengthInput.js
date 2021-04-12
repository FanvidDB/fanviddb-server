import React from "react";
import loadable from "@loadable/component";
import { Input } from "antd";

const LoadableComponent = loadable(() => import("./PasswordStrengthInput"), {
  fallback: <Input disabled={true} />,
});

export default function LoadablePasswordInput() {
  return <LoadableComponent />;
}
