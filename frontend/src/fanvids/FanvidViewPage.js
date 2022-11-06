import React, { useState, useEffect } from "react";
import {
  Space,
  Skeleton,
  PageHeader,
  Button,
  Descriptions,
  Tag,
  Typography,
  Image,
  Row,
  Col,
  List,
  Divider,
} from "antd";
import { Localized, useLocalization } from "@fluent/react";
import { useParams, Link } from "react-router-dom";
import Http404Page from "../pages/Http404Page";
import Http500Page from "../pages/Http500Page";
import Helmet from "react-helmet";
import moment from "moment";
import { contentNotes, ratings, languages } from "./constants";

const { Paragraph, Title, Text } = Typography;

const FanvidViewPage = () => {
  const { l10n } = useLocalization();
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [is500, setIs500] = useState(false);
  const [fanvid, setFanvid] = useState({});
  const { uuid } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/fanvids/" + uuid, { method: "GET" })
      .then((response) => {
        if (response.status == 404) {
          setIs404(true);
        } else if (!response.ok) {
          setIs500(true);
        } else {
          setFanvid(response.json());
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIs500(true);
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
        subTitle={
          <Space>
            <span>{fanvid.creators}</span>
            <Divider type="vertical" />
            <span>{fanvid.fandoms}</span>
          </Space>
        }
        tags={
          <>
            <Tag>{ratings[fanvid.rating]}</Tag>
            {fanvid.content_notes.map((contentNote) => (
              <Tag
                key={contentNote}
                color={
                  contentNote === "no-warnings-apply" ? "default" : "volcano"
                }
              >
                {contentNotes[contentNote]}
              </Tag>
            ))}
          </>
        }
        extra={
          <Button key="edit">
            <Link to={`/fanvids/edit/${fanvid.uuid}`}>
              <Localized id="fanvid-view-page-edit-link" />
            </Link>
          </Button>
        }
      >
        <Row>
          <Col span={4}>
            <Title level={5}>
              <Localized id="fanvid-view-page-fanvid-length-header" />
            </Title>
            <Text>{fanvidLength.format("mm:ss")}</Text>
          </Col>
          <Col span={6}>
            <Title level={5}>
              <Localized id="fanvid-view-page-fanvid-audio-header" />
            </Title>
            <Paragraph>
              {fanvid.audio.title}
              <br />
              {fanvid.audio.artists_or_sources}
              <br />

              {fanvid.audio.languages.map((language) => (
                <span key={language}>
                  {languages[language]}
                  <br />
                </span>
              ))}
            </Paragraph>
          </Col>
          <Col span={6}>
            <Title level={5}>
              <Localized id="fanvid-view-page-fanvid-premiere-header" />
            </Title>
            <Paragraph>
              {fanvid.premiere_event}
              <br />
              {moment(fanvid.premiere_date).format("L")}
            </Paragraph>
          </Col>
          <Col span={8}>
            <Image src={fanvid.thumbnail_url} />
          </Col>
        </Row>
        <Paragraph>{fanvid.summary}</Paragraph>
        <List
          header={<Localized id="fanvid-view-page-fanvid-urls-header" />}
          size="small"
          dataSource={fanvid.urls}
          renderItem={(url) => (
            <List.Item>
              <a href={url}>{url}</a>
            </List.Item>
          )}
        />
      </PageHeader>

      <Divider />
      <Descriptions size="small" colon={false}>
        <Descriptions.Item
          label={
            <Text type="secondary">
              <Localized id="fanvid-view-page-added-label" />
            </Text>
          }
        >
          <Text type="secondary">
            {moment(fanvid.created_timestamp).format("LLL")}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Text type="secondary">
              <Localized id="fanvid-view-page-modified-label" />
            </Text>
          }
        >
          <Text type="secondary">
            {moment(fanvid.modified_timestamp).format("LLL")}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default FanvidViewPage;
