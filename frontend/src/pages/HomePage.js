import React, { useContext } from "react";
import { Skeleton, Button } from "antd";
import { Localized } from "@fluent/react";
import LoginPage from "../auth/LoginPage";
import AuthContext from "../auth/authContext";

const HomePage = () => {
  const { user, isLoading, logout } = useContext(AuthContext);
  if (isLoading) {
    return <Skeleton />;
  }
  if (!user) {
    return <LoginPage />;
  }
  return (
    <div>
      <p>Placeholder for fanvid list page</p>
      <p>{user.username}</p>
      <Button onClick={logout}>
        <Localized id="logout-button" />
      </Button>
    </div>
  );
};

export default HomePage;
