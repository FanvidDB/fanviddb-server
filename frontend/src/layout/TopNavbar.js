import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { Localized } from "@fluent/react";

const { Item } = Menu;

const TopNavbar = () => (
  <Menu theme="dark" mode="horizontal" selectable={false}>
    <Item key="home">
      <Link to="/">
        <Localized id="top-navbar-website-name" />
      </Link>
    </Item>
  </Menu>
);

export default TopNavbar;
