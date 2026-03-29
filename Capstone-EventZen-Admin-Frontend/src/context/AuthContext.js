import PropTypes from "prop-types";
import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const getStoredAuth = () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userRaw =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  };

  const [auth, setAuth] = useState(getStoredAuth);

  // Call this after a successful sign-in (storage already set by sign-in page)
  const refreshAuth = useCallback(() => {
    setAuth(getStoredAuth());
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setAuth({ token: null, user: null });
  }, []);

  const isAuthenticated = Boolean(auth.token);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user: auth.user, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
