import React from "react";
import { Localized, useLocalization } from "@fluent/react";
import { useNavigate } from "react-router-dom";
import FanvidEditForm from "./FanvidEditForm";
import Helmet from "react-helmet";

const DEFAULT_FANVID = {
  urls: [""],
  unique_identifiers: [{ kind: "filename", identifier: "" }],
};

const FanvidCreatePage = () => {
  let navigate = useNavigate();
  const { l10n } = useLocalization();

  const onFanvidSaved = (fanvid) => {
    navigate("/fanvids/edit/" + fanvid.uuid);
  };

  return (
    <>
      <Helmet>
        <title>{l10n.getString("fanvid-create-page-title-bar")}</title>
      </Helmet>
      <div>
        <h1>
          <Localized id="fanvid-create-page-title" />
        </h1>
        <FanvidEditForm fanvid={DEFAULT_FANVID} onFanvidSaved={onFanvidSaved} />
      </div>
    </>
  );
};

export default FanvidCreatePage;
