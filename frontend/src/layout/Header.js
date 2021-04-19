import React from "react";
import { Link } from "react-router-dom";
import { Menu, Layout } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Localized } from "@fluent/react";

const { SubMenu, Item } = Menu;

const Header = () => (
  <Layout.Header className="header">
    <Menu theme="dark" mode="horizontal" selectable={false}>
      <Item key="home">
        <Link to="/">
          <Localized id="top-navbar-website-name" />
        </Link>
      </Item>
      <Item key="using-with-plex">
        <a href="https://docs.fanviddb.com">
          <Localized id="top-navbar-using-with-plex" />
        </a>
      </Item>
      <SubMenu
        key="contributing"
        title={<Localized id="top-navbar-contributing" />}
      >
        <Item>
          <a href="https://docs.fanviddb.com/contributing/fanvid-data.html">
            <Localized id="top-navbar-contributing-fanvid-data" />
          </a>
        </Item>
        <Item>
          <a href="https://docs.fanviddb.com/contributing/translation.html">
            <Localized id="top-navbar-contributing-translation" />
          </a>
        </Item>
        <Item>
          <a href="https://docs.fanviddb.com/contributing/documentation.html">
            <Localized id="top-navbar-contributing-documentation" />
          </a>
        </Item>
      </SubMenu>
      <SubMenu key="coding" title={<Localized id="top-navbar-coding" />}>
        <Item>
          <a href="https://docs.fanviddb.com/coding/frontend.html">
            <Localized id="top-navbar-coding-frontend" />
          </a>
        </Item>
        <Item>
          <a href="https://docs.fanviddb.com/coding/backend.html">
            <Localized id="top-navbar-coding-backend" />
          </a>
        </Item>
        <Item>
          <a href="https://docs.fanviddb.com/coding/metadata-agent.html">
            <Localized id="top-navbar-coding-metadata-agent" />
          </a>
        </Item>
        <Item>
          <a href="https://docs.fanviddb.com/coding/docs-site.html">
            <Localized id="top-navbar-coding-docs-site" />
          </a>
        </Item>
      </SubMenu>
      <Item key="about">
        <a href="https://docs.fanviddb.com/about">
          <Localized id="top-navbar-about" />
        </a>
      </Item>
      <Item key="report-issue">
        <a
          href="https://github.com/FanvidDB/fanviddb-server/issues/new"
          target="_blank"
          rel="noreferrer"
        >
          <GithubOutlined />
          <Localized id="top-navbar-report-issue" />
        </a>
      </Item>
    </Menu>
  </Layout.Header>
);

export default Header;
