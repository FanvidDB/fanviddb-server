import React, { useContext } from "react";
import { Skeleton, Button } from "antd";
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
      <p>Hello {user.username}</p>
      <Button onClick={logout}>Log out</Button>
    </div>
  );
};

export default HomePage;
