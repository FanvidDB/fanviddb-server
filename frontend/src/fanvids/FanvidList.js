import React, { useState, useEffect } from "react";
import { List, Skeleton, Alert, Space, Typography, Tag } from "antd";
import { Link, useLocation } from "react-router-dom";
import { Localized } from "@fluent/react";
import { callApi } from "../api";
import { contentNotes, ratings } from "./constants";
import _ from "lodash";

const { Text, Paragraph } = Typography;

const FanvidList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fanvids, setFanvids] = useState([]);
  const [errors, setErrors] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    setIsLoading(true);
    callApi("/api/fanvids", "GET").then(({ ok, json }) => {
      setIsLoading(false);
      if (!ok) {
        setErrors([
          <Localized key="error-unknown" id="fanvid-list-error-unknown" />,
        ]);
      } else {
        setFanvids(json.fanvids);
      }
    });
  }, [searchParams.page]);

  if (!_.isEmpty(errors)) {
    return (
      <Alert>
        <List
          dataSource={errors}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Alert>
    );
  }

  return (
    <List
      itemLayout="vertical"
      loading={isLoading}
      dataSource={fanvids}
      renderItem={(fanvid) => (
        <List.Item
          actions={[
            <Link key="edit" to={`/fanvids/edit/${fanvid.uuid}`}>
              edit
            </Link>,
            <Tag key={fanvid.rating} color="default">
              {ratings[fanvid.rating]}
            </Tag>,
            <>
              {fanvid.content_notes.map((contentNote) => {
                if (contentNote == "no-warnings-apply") return null;
                if (
                  !Object.prototype.hasOwnProperty.call(
                    contentNotes,
                    contentNote
                  )
                )
                  return null;
                return (
                  <Tag key={contentNote} color="volcano">
                    {contentNotes[contentNote]}
                  </Tag>
                );
              })}
            </>,
          ]}
        >
          <Skeleton loading={fanvid.loading} active>
            <List.Item.Meta
              title={
                <Link to={`/fanvids/view/${fanvid.uuid}`}>{fanvid.title}</Link>
              }
              description={
                <Space>
                  <Text type="secondary">{fanvid.creators}</Text>
                  <Text type="secondary">{fanvid.fandoms}</Text>
                </Space>
              }
            />
            <Paragraph>{fanvid.summary}</Paragraph>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default FanvidList;
