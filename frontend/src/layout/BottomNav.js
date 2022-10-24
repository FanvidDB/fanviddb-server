import React from "react";
import { Localized } from "@fluent/react";
import { Menu, Space, Typography } from "antd";
import { GithubOutlined } from "@ant-design/icons";

const { Title } = Typography;

const BottomNav = () => {
  return (
    <Space align="start">
      <div>
        <Title level={5}>
          <Localized id="bottom-nav-general" />
        </Title>
        <Menu
          selectable={false}
          mode="inline"
          items={[
            {
              key: "using-with-plex",
              label: (
                <a href="https://docs.fanviddb.com">
                  <Localized id="bottom-nav-general-using-with-plex" />
                </a>
              ),
            },
            {
              key: "about",
              label: (
                <a href="https://docs.fanviddb.com/about">
                  <Localized id="bottom-nav-general-about" />
                </a>
              ),
            },
            {
              key: "report-issue",
              label: (
                <a
                  href="https://github.com/FanvidDB/fanviddb-server/issues/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubOutlined />
                  <Localized id="bottom-nav-general-report-issue" />
                </a>
              ),
            },
          ]}
        />
      </div>
      <div>
        <Title level={5}>
          <Localized id="bottom-nav-contributing" />
        </Title>
        <Menu
          selectable={false}
          mode="inline"
          items={[
            {
              key: "contributing-fanvid-data",
              label: (
                <a href="https://docs.fanviddb.com/contributing/fanvid-data.html">
                  <Localized id="bottom-nav-contributing-fanvid-data" />
                </a>
              ),
            },
            {
              key: "contributing-translation",
              label: (
                <a href="https://docs.fanviddb.com/contributing/translation.html">
                  <Localized id="bottom-nav-contributing-translation" />
                </a>
              ),
            },
            {
              key: "contributing-documentation",
              label: (
                <a href="https://docs.fanviddb.com/contributing/documentation.html">
                  <Localized id="bottom-nav-contributing-documentation" />
                </a>
              ),
            },
          ]}
        />
      </div>
      <div>
        <Title level={5}>
          <Localized id="bottom-nav-coding" />
        </Title>
        <Menu
          selectable={false}
          mode="inline"
          items={[
            {
              key: "coding-frontend",
              label: (
                <a href="https://docs.fanviddb.com/coding/frontend.html">
                  <Localized id="bottom-nav-coding-frontend" />
                </a>
              ),
            },
            {
              key: "coding-backend",
              label: (
                <a href="https://docs.fanviddb.com/coding/backend.html">
                  <Localized id="bottom-nav-coding-backend" />
                </a>
              ),
            },
            {
              key: "coding-metadata-agent",
              label: (
                <a href="https://docs.fanviddb.com/coding/metadata-agent.html">
                  <Localized id="bottom-nav-coding-metadata-agent" />
                </a>
              ),
            },
            {
              key: "coding-docs-site",
              label: (
                <a href="https://docs.fanviddb.com/coding/docs-site.html">
                  <Localized id="bottom-nav-coding-docs-site" />
                </a>
              ),
            },
            {
              key: "coding-api",
              label: (
                <a href="/api/redoc">
                  <Localized id="bottom-nav-coding-api" />
                </a>
              ),
            },
          ]}
        />
      </div>
    </Space>
  );
};

export default BottomNav;
