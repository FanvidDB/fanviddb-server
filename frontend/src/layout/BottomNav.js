import React from "react";
import { Localized } from "@fluent/react";
import { Menu, Space, Typography } from "antd";
import { GithubOutlined } from "@ant-design/icons";

const { Item } = Menu;
const { Title } = Typography;

const BottomNav = () => {
  return (
    <Space align="start">
      <div>
        <Title level={5}>
          <Localized id="bottom-nav-general" />
        </Title>
        <Menu selectable={false} mode="inline">
          <Item key="using-with-plex">
            <a href="https://docs.fanviddb.com">
              <Localized id="bottom-nav-general-using-with-plex" />
            </a>
          </Item>
          <Item key="about">
            <a href="https://docs.fanviddb.com/about">
              <Localized id="bottom-nav-general-about" />
            </a>
          </Item>
          <Item key="report-issue">
            <a
              href="https://github.com/FanvidDB/fanviddb-server/issues/new"
              target="_blank"
              rel="noreferrer"
            >
              <GithubOutlined />
              <Localized id="bottom-nav-general-report-issue" />
            </a>
          </Item>
        </Menu>
      </div>
      <div>
        <Title level={5}>
          <Localized id="bottom-nav-contributing" />
        </Title>
        <Menu selectable={false} mode="inline">
          <Item>
            <a href="https://docs.fanviddb.com/contributing/fanvid-data.html">
              <Localized id="bottom-nav-contributing-fanvid-data" />
            </a>
          </Item>
          <Item>
            <a href="https://docs.fanviddb.com/contributing/translation.html">
              <Localized id="bottom-nav-contributing-translation" />
            </a>
          </Item>
          <Item>
            <a href="https://docs.fanviddb.com/contributing/documentation.html">
              <Localized id="bottom-nav-contributing-documentation" />
            </a>
          </Item>
        </Menu>
      </div>
      <div>
        <Title level={5}>
          <Localized id="bottom-nav-coding" />
        </Title>
        <Menu selectable={false} mode="inline">
          <Item>
            <a href="https://docs.fanviddb.com/coding/frontend.html">
              <Localized id="bottom-nav-coding-frontend" />
            </a>
          </Item>
          <Item>
            <a href="https://docs.fanviddb.com/coding/backend.html">
              <Localized id="bottom-nav-coding-backend" />
            </a>
          </Item>
          <Item>
            <a href="https://docs.fanviddb.com/coding/metadata-agent.html">
              <Localized id="bottom-nav-coding-metadata-agent" />
            </a>
          </Item>
          <Item>
            <a href="https://docs.fanviddb.com/coding/docs-site.html">
              <Localized id="bottom-nav-coding-docs-site" />
            </a>
          </Item>
          <Item>
            <a href="/api/redoc">
              <Localized id="bottom-nav-coding-api" />
            </a>
          </Item>
        </Menu>
      </div>
    </Space>
  );
};

export default BottomNav;
