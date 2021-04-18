import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { callApi } from "../api";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = async () => {
    setIsLoading(true);
    const { ok, json } = await callApi("/api/users/me", "GET");
    if (!ok) {
      console.log("Error fetching user information", json);
    } else {
      setUser(json);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    const { ok, json } = await callApi("/api/auth/logout", "POST");
    if (!ok) {
      console.log("Error logging out", json);
    } else {
      setUser(undefined);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, loadUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default AuthContext;
