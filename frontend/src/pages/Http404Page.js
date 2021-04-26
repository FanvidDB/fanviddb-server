import React from "react";
import Helmet from "react-helmet";
import { Result, Button } from "antd";
import { Localized, useLocalization } from "@fluent/react";

const Http404Page = () => {
  const l10n = useLocalization();

  return (
    <>
      <Helmet>
        <title>{l10n.getString("error-404")}</title>
      </Helmet>
      <Result
        title={<Localized id="error-404" />}
        extra={
          <Button type="primary" href="/">
            Return Home
          </Button>
        }
      />
    </>
  );
};

export default Http404Page;
