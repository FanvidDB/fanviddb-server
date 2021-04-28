import React from "react";
import FanvidList from "./FanvidList";
import Helmet from "react-helmet";
import { useLocalization } from "@fluent/react";

const FanvidListPage = () => {
  const { l10n } = useLocalization();
  return (
    <>
      <Helmet>
        <title>{l10n.getString("fanvid-list-page-title-bar")}</title>
      </Helmet>
      <FanvidList />
    </>
  );
};

export default FanvidListPage;
