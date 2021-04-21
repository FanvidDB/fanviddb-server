import React, { useState, useEffect } from "react";
import { Skeleton } from "antd";
import { Localized } from "@fluent/react";
import { useParams, useHistory } from "react-router-dom";
import { callApi } from "../api";
import FanvidEditForm from "./FanvidEditForm";

const FanvidEditPage = () => {
  const { uuid } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [is500, setIs500] = useState(false);
  const [fanvid, setFanvid] = useState({});

  useEffect(() => {
    if (!uuid) {
      setIsLoading(false);
      setFanvid({});
    } else {
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
    }
  }, [uuid]);

  const onFanvidSaved = (fanvid) => {
    if (fanvid.uuid != uuid) {
      history.push("/fanvid/edit/" + fanvid.uuid);
    } else {
      setFanvid(fanvid);
    }
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (is404) {
    // placeholder
    return <p>404 not found</p>;
  }

  if (is500) {
    // placeholder
    return (
      <p>
        <Localized id="fanvid-form-error-unknown" />
      </p>
    );
  }

  return (
    <div>
      <h1>
        {uuid ? fanvid.title : <Localized id="fanvid-page-create-title" />}
      </h1>
      <FanvidEditForm fanvid={fanvid} onFanvidSaved={onFanvidSaved} />
    </div>
  );
};

export default FanvidEditPage;
