import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Localized } from "@fluent/react";
import AuthContext from "../auth/authContext";

const { Item } = Menu;

const SideNav = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return null;
  }
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectable={false}
      selectedKeys={[location.pathname]}
    >
      <Item key="/fanvids/add">
        <Link to="/fanvids/add">
          <PlusOutlined />
          <Localized id="side-nav-add-fanvid" />
        </Link>
      </Item>
    </Menu>
  );
};

export default SideNav;
