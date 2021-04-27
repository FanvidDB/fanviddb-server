import React from "react";
import Helmet from "react-helmet";
import { Result, Button } from "antd";
import { Localized, useLocalization } from "@fluent/react";

const Http500Page = () => {
  const { l10n } = useLocalization();

  return (
    <>
      <Helmet>
        <title>{l10n.getString("http-500-page-title-bar")}</title>
      </Helmet>
      <Result
        title={<Localized id="http-500-page-title" />}
        extra={
          <Button type="primary" href="/">
            <Localized id="http-500-page-escape-button" />
          </Button>
        }
      />
    </>
  );
};

export default Http500Page;
