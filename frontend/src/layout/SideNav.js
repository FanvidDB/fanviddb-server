import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Localized } from "@fluent/react";
import AuthContext from "../auth/authContext";

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
      items={[{
        key: "fanvids-add",
        label: <Link to="/fanvids/add"><PlusOutlined /><Localized id="side-nav-add-fanvid" /></Link>
      }]}
    />
  );
};

export default SideNav;
