import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = async () => {
    setIsLoading(true);
    fetch("/api/users/me", { method: "GET" })
      .then((response) => {
        // 401 means not logged in, so no action to take.
        if (response.status != 401) {
          if (!response.ok) {
            console.log("Error fetching user information", response.text());
          } else {
            setUser(response.json());
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        console.log("Request aborted while fetching user information");
        setIsLoading(false);
      });
  };

  const logout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      console.log("Error logging out", response.text());
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
