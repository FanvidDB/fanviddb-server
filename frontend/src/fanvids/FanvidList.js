import React, { useState, useEffect } from "react";
import { List, Skeleton, Alert } from "antd";
import { Link, useLocation } from "react-router-dom";
import { Localized } from "@fluent/react";
import { callApi } from "../api";
import _ from "lodash";

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
        setFanvids(json);
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
      itemLayout="horizontal"
      loading={isLoading}
      dataSource={fanvids}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Link key="edit" to={`/fanvids/edit/${item.uuid}`}>
              edit
            </Link>,
          ]}
        >
          <Skeleton loading={item.loading} active>
            <List.Item.Meta
              title={
                <Link to={`/fanvids/view/${item.uuid}`}>{item.title}</Link>
              }
              description={item.summary}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default FanvidList;
