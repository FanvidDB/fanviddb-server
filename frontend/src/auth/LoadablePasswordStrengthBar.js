import React from "react";
import loadable from "@loadable/component";
import { Progress } from "antd";

const LoadableComponent = loadable(() => import("./PasswordStrengthBar"), {
  fallback: <Progress showInfo={false} steps={4} />,
});

export default function LoadablePasswordBar(props) {
  return <LoadableComponent {...props} />;
}
