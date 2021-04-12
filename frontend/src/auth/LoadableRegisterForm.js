import React from "react";
import loadable from "@loadable/component";
import { Skeleton } from "antd";

const LoadableComponent = loadable(() => import("./RegisterForm"), {
  fallback: <Skeleton active />,
});

export default function LoadableRegisterForm(props) {
  return <LoadableComponent {...props} />;
}
