import React, { createContext, useContext, useState, useEffect } from "react";
import {
  authenticate as authServiceLogin,
  logout as authServiceLogout
} from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [token, setToken] = useState(localStorage.getItem('token'));

  // On initial load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('auth'));
    if (user) setAuthUser(user);
  }, []);

  // 1. Call Cognito login, return token + email (do not set authUser yet)
  const authenticate = (email, password) => {
    return authServiceLogin(email, password);
  };

  // 2. Store after verifying security & cipher
  const setVerifiedAuthUser = (auth) => {
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("token", auth.jwtToken);

    setAuthUser(auth);
    setToken(auth.jwtToken)
  };

  // 3. Logout
  const logout = () => {
    authServiceLogout();
    setAuthUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        authenticate,
        logout,
        token,
        setVerifiedAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
