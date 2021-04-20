import React, { useContext } from "react";
import { Skeleton } from "antd";
import LoginPage from "../auth/LoginPage";
import AuthContext from "../auth/authContext";

const HomePage = () => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return <Skeleton />;
  }
  if (!user) {
    return <LoginPage />;
  }
  return (
    <div>
      <p>Placeholder for fanvid list page</p>
    </div>
  );
};

export default HomePage;
