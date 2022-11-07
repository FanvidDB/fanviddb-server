import React, { useState, useEffect } from "react";
import { List, Skeleton, Alert, Space, Typography, Tag } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Localized } from "@fluent/react";
import { contentNotes, ratings } from "./constants";
import _ from "lodash";

const { Text, Paragraph } = Typography;

const PAGE_SIZE = 10;

const FanvidList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [fanvids, setFanvids] = useState([]);
  const [errors, setErrors] = useState([]);
  const location = useLocation();
  let navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  let currentPage = parseInt(searchParams.get("page"));
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `/api/fanvids?limit=${PAGE_SIZE}&offset=${PAGE_SIZE * (currentPage - 1)}`,
      { method: "GET" }
    )
      .then((response) => {
        setIsLoading(false);
        if (!response.ok) {
          setErrors([
            <Localized key="error-unknown" id="fanvid-list-error-unknown" />,
          ]);
        } else {
          response
            .json()
            .then(({ fanvids, total_count }) => {
              setFanvids(fanvids);
              setTotalCount(total_count);
            })
            .catch(() => {
              setErrors([
                <Localized
                  key="error-unknown"
                  id="fanvid-list-error-unknown"
                />,
              ]);
            });
        }
      })
      .catch(() => {
        setIsLoading(false);
        setErrors([
          <Localized key="error-unknown" id="fanvid-list-error-unknown" />,
        ]);
      });
  }, [currentPage]);

  const onChangePage = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    navigate(`${location.path || ""}?${searchParams.toString()}`);
  };

  if (!_.isEmpty(errors)) {
    return (
      <Alert
        type="error"
        message={
          <List
            dataSource={errors}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        }
      />
    );
  }

  return (
    <List
      itemLayout="vertical"
      loading={isLoading}
      dataSource={fanvids}
      pagination={{
        position: "both",
        pageSize: PAGE_SIZE,
        total: totalCount,
        current: currentPage,
        onChange: onChangePage,
      }}
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
