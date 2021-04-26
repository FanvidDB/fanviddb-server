import React from "react";
import Helmet from "react-helmet";
import { Result, Button } from "antd";
import { Localized, useLocalization } from "@fluent/react";

const Http500Page = () => {
  const l10n = useLocalization();

  return (
    <>
      <Helmet>
        <title>{l10n.getString("error-500")}</title>
      </Helmet>
      <Result
        title={<Localized id="error-500" />}
        extra={
          <Button type="primary" href="/">
            Return Home
          </Button>
        }
      />
    </>
  );
};

export default Http500Page;
