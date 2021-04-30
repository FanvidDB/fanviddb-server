import React, { useState, useEffect } from "react";
import { Skeleton, PageHeader, Button, Descriptions } from "antd";
import { useLocalization } from "@fluent/react";
import { useParams, Link } from "react-router-dom";
import { callApi } from "../api";
import Http404Page from "../pages/Http404Page";
import Http500Page from "../pages/Http500Page";
import Helmet from "react-helmet";
import moment from "moment";

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

  const fanvidLength = moment.utc(fanvid.length * 1000);
  return (
    <>
      <Helmet>
        <title>
          {l10n.getString("fanvid-view-page-title-bar", {
            title: fanvid.title,
          })}
        </title>
      </Helmet>
      <PageHeader
        title={fanvid.title}
        subTitle={fanvid.creators}
        extra={
          <Button key="edit">
            <Link to={`/fanvids/edit/${fanvid.uuid}`}>Edit</Link>
          </Button>
        }
      >
        <Descriptions size="small">
          <Descriptions.Item label="Fandoms">
            {fanvid.fandoms}
          </Descriptions.Item>
          <Descriptions.Item label="Premiere date">
            {fanvid.premiere_date}
          </Descriptions.Item>
          <Descriptions.Item label="Premiere event">
            {fanvid.premiere_event}
          </Descriptions.Item>
          <Descriptions.Item label="Audio Title">
            {fanvid.audio.title}
          </Descriptions.Item>
          <Descriptions.Item label="Audio Artists or Sources">
            {fanvid.audio.artists_or_sources}
          </Descriptions.Item>
          <Descriptions.Item label="Audio Language">
            {fanvid.audio.language}
          </Descriptions.Item>
          <Descriptions.Item label="Length">
            {fanvidLength.format("mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Rating">{fanvid.rating}</Descriptions.Item>
          <Descriptions.Item label="Content notes">
            {fanvid.content_notes}
          </Descriptions.Item>
        </Descriptions>
        <img src={fanvid.thumbnail_url} style={{ maxWidth: "100%" }} />
        <p>{fanvid.summary}</p>
        <Descriptions size="small">
          <Descriptions.Item label="URLs">
            <ul>
              {fanvid.urls.map((url) => (
                <li key={url}>
                  <a href={url}>{url}</a>
                </li>
              ))}
            </ul>
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {moment(fanvid.created_timestamp).format()}
          </Descriptions.Item>
          <Descriptions.Item label="Modified">
            {moment(fanvid.modified_timestamp).format()}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </>
  );
};

export default FanvidViewPage;
