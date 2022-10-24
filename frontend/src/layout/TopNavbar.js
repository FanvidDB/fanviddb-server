import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Localized } from "@fluent/react";
import LocaleSelector from "../i18n/LocaleSelector";
import AuthContext from "../auth/authContext";
import ApiKeyModal from "../auth/ApiKeyModal";

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const items = [
    {
      key: "home",
      label: (
        <Link to="/">
          <Localized id="top-navbar-website-name" />
        </Link>
      ),
    },
    {
      key: "locale",
      label: <LocaleSelector />,
    },
    {
      key: "api-key",
      icon: <KeyOutlined />,
      onClick: () => setShowApiKeyModal(true),
      label: (
        <span>
          <Localized id="top-navbar-get-api-key" />
          <ApiKeyModal
            open={showApiKeyModal}
            onCancel={(e) => {
              e.stopPropagation();
              setShowApiKeyModal(false);
            }}
          />
        </span>
      ),
    },
  ];

  if (user) {
    items.push({
      key: "submenu",
      icon: <UserOutlined />,
      label: user.username,
      children: [
        {
          key: "logout",
          label: <Localized id="logout-button" />,
          onClick: logout,
        },
      ],
    });
  }

  return (
    <Menu theme="dark" mode="horizontal" selectable={false} items={items} />
  );
};

export default TopNavbar;
