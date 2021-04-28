import React, { useState, useEffect } from "react";
import { Skeleton } from "antd";
import { useLocalization } from "@fluent/react";
import { useParams, Link } from "react-router-dom";
import { callApi } from "../api";
import Http404Page from "../pages/Http404Page";
import Http500Page from "../pages/Http500Page";
import Helmet from "react-helmet";

const FanvidViewPage = () => {
  const { l10n } = useLocalization();
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [is500, setIs500] = useState(false);
  const [fanvid, setFanvid] = useState({});
  const { uuid } = useParams();

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

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>{l10n.getString("fanvid-view-page-title-bar-loading")}</title>
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
          {l10n.getString("fanvid-view-page-title-bar", {
            title: fanvid.title,
          })}
        </title>
      </Helmet>
      <h1>{fanvid.title}</h1>
      <p>{fanvid.summary}</p>
      <p>
        <Link to={`/fanvids/edit/${fanvid.uuid}`}>Edit</Link>
      </p>
    </>
  );
};

export default FanvidViewPage;
