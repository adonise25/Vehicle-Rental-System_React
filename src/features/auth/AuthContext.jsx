import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clearToken,
  getToken,
  SESSION_EXPIRED_EVENT,
  setToken,
} from "../../shared/session";

import { storage } from "../../shared/storage";
import { authApi } from "./api";

const AuthContext = createContext(null);

const EMAIL_KEY = "driveeasy_email";
const USER_KEY = "driveeasy_user";

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  const [email, setEmail] = useState(() =>
    storage.get(EMAIL_KEY)
  );

  const [user, setUser] = useState(() => {
    const savedUser = storage.get(USER_KEY);

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (credentials) => {
    const newToken = await authApi.login(credentials);

    setToken(newToken);

    const loggedInEmail = credentials.email.trim();

    storage.set(EMAIL_KEY, loggedInEmail);

    setTokenState(newToken);
    setEmail(loggedInEmail);

    const currentUser = await authApi.getCurrentUser();

    storage.set(USER_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
  }, []);

  const register = useCallback(
    (credentials) => authApi.register(credentials),
    []
  );

  const logout = useCallback(() => {
    clearToken();

    storage.remove(EMAIL_KEY);
    storage.remove(USER_KEY);

    setTokenState(null);
    setEmail(null);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener(
      SESSION_EXPIRED_EVENT,
      logout
    );

    return () =>
      window.removeEventListener(
        SESSION_EXPIRED_EVENT,
        logout
      );
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      email,
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [
      token,
      email,
      user,
      login,
      register,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside <AuthProvider>"
    );
  }

  return ctx;
}