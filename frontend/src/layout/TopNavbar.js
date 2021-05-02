import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Localized } from "@fluent/react";
import LocaleSelector from "../i18n/LocaleSelector";
import AuthContext from "../auth/authContext";
import ApiKeyModal from "../auth/ApiKeyModal";

const { Item, SubMenu } = Menu;

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  return (
    <Menu theme="dark" mode="horizontal" selectable={false}>
      <Item key="home">
        <Link to="/">
          <Localized id="top-navbar-website-name" />
        </Link>
      </Item>
      <Item>
        <LocaleSelector />
      </Item>
      <Item icon={<KeyOutlined />} onClick={() => setShowApiKeyModal(true)}>
        <Localized id="top-navbar-get-api-key" />
        <ApiKeyModal
          visible={showApiKeyModal}
          onClose={(e) => {
            e.stopPropagation();
            setShowApiKeyModal(false);
          }}
        />
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
