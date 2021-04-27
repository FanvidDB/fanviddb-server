import React, { useState, useEffect } from "react";
import { Skeleton } from "antd";
import { Localized, useLocalization } from "@fluent/react";
import { useParams, useHistory } from "react-router-dom";
import { callApi } from "../api";
import Http404Page from "../pages/Http404Page";
import Http500Page from "../pages/Http500Page";
import FanvidEditForm from "./FanvidEditForm";
import Helmet from "react-helmet";

const FanvidEditPage = () => {
  const { uuid } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [is500, setIs500] = useState(false);
  const [fanvid, setFanvid] = useState({});
  const { l10n } = useLocalization();

  useEffect(() => {
    setIsLoading(true);
    callApi("/api/fanvids/" + uuid, "GET").then(({ status, ok, json }) => {
      if (status == 404) {
        setIs404(true);
      } else if (!ok) {
        setIs500(true);
      } else {
        setFanvid(json);
      }
      setIsLoading(false);
    });
  }, [uuid]);

  const onFanvidSaved = (fanvid) => {
    if (fanvid.uuid != uuid) {
      history.push("/fanvids/edit/" + fanvid.uuid);
    } else {
      setFanvid(fanvid);
    }
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>{l10n.getString("fanvid-edit-page-title-bar-loading")}</title>
        </Helmet>
        <Skeleton />
      </>
    );
  }

  if (is404) {
    return <Http404Page />;
  }
  if (is500) {
    return <Http500Page />;
  }
  return (
    <>
      <Helmet>
        <title>
          {l10n.getString("fanvid-edit-page-title-bar", {
            title: fanvid.title,
          })}
        </title>
      </Helmet>
      <div>
        <h1>
          <Localized
            id="fanvid-edit-page-title"
            vars={{
              title: fanvid.title,
            }}
          />
        </h1>
        <FanvidEditForm fanvid={fanvid} onFanvidSaved={onFanvidSaved} />
      </div>
    </>
  );
};

export default FanvidEditPage;
