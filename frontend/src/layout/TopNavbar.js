import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { Localized } from "@fluent/react";
import LocaleSelector from "../i18n/LocaleSelector";

const { Item } = Menu;

const TopNavbar = () => (
  <div>
    <Menu
      theme="dark"
      mode="horizontal"
      selectable={false}
      style={{ float: "left" }}
    >
      <Item key="home">
        <Link to="/">
          <Localized id="top-navbar-website-name" />
        </Link>
      </Item>
    </Menu>

    <LocaleSelector />
  </div>
);

export default TopNavbar;
