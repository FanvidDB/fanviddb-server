import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Localized } from "@fluent/react";
import LocaleSelector from "../i18n/LocaleSelector";
import AuthContext from "../auth/authContext";

const { Item, SubMenu } = Menu;

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
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
      <Item>
        <LocaleSelector />
      </Item>
      {user && (
        <SubMenu title={user.username} icon={<UserOutlined />}>
          <Item onClick={logout}>
            <Localized id="logout-button" />
          </Item>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNavbar;
