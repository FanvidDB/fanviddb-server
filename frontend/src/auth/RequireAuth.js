import React, { useContext } from "react";
import { Skeleton } from "antd";
import AuthContext from "./authContext";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

const RequireAuth = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return <Skeleton />;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default RequireAuth;
