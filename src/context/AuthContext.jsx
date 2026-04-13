/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API_BASE } from "../api";

const AUTH_STORAGE_KEY = "fashion_auth_v1";
const AuthContext = createContext(null);

const readStoredAuth = () => {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { token: "", user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || "",
      user: parsed?.user || null,
    };
  } catch {
    return { token: "", user: null };
  }
};

const getInitial = (name) => {
  const safe = String(name || "?").trim();
  return safe ? safe.charAt(0).toUpperCase() : "?";
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredAuth().token);
  const [user, setUser] = useState(() => readStoredAuth().user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token, user }),
    );
  }, [token, user]);

  const authFetch = useCallback(
    async (url, options = {}) => {
      const isFormData =
        typeof FormData !== "undefined" && options.body instanceof FormData;

      const res = await fetch(url, {
        ...options,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 404 && String(url).includes("/auth/")) {
          const authApiError = new Error(
            `Khong tim thay API auth (${API_BASE}). Hay kiem tra backend dang chay dung dia chi.`,
          );
          authApiError.status = res.status;
          throw authApiError;
        }
        const requestError = new Error(data?.message || "Request failed");
        requestError.status = res.status;
        throw requestError;
      }
      return data;
    },
    [token],
  );

  const requestRegisterOtp = useCallback(
    async (payload) => {
      return authFetch(`${API_BASE}/auth/register/request-otp`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    [authFetch],
  );

  const register = useCallback(
    async (payload) => {
      try {
        const data = await authFetch(`${API_BASE}/auth/register`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToken(data.token || "");
        setUser(data.user || null);
        return data;
      } catch (error) {
        const message = String(error?.message || "");
        if (!message.includes("Khong tim thay API auth")) {
          throw error;
        }

        await authFetch(`${API_BASE}/nguoi-dung`, {
          method: "POST",
          body: JSON.stringify({
            username: String(payload?.username || "").trim(),
            email: String(payload?.email || "").trim(),
            password: String(payload?.password || ""),
          }),
        });

        const loginData = await authFetch(`${API_BASE}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            identifier: String(
              payload?.email || payload?.username || "",
            ).trim(),
            password: String(payload?.password || ""),
          }),
        });
        setToken(loginData.token || "");
        setUser(loginData.user || null);
        return loginData;
      }
    },
    [authFetch],
  );

  const verifyRegisterOtp = useCallback(
    async (payload) => {
      const data = await authFetch(`${API_BASE}/auth/register/verify-otp`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setToken(data.token || "");
      setUser(data.user || null);
      return data;
    },
    [authFetch],
  );

  const login = useCallback(
    async (payload) => {
      const data = await authFetch(`${API_BASE}/auth/login`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setToken(data.token || "");
      setUser(data.user || null);
      return data;
    },
    [authFetch],
  );

  const loginWithGoogle = useCallback(
    async (idToken) => {
      const data = await authFetch(`${API_BASE}/auth/google`, {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      setToken(data.token || "");
      setUser(data.user || null);
      return data;
    },
    [authFetch],
  );

  const fetchMe = useCallback(async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const me = await authFetch(`${API_BASE}/auth/me`);
      setUser(me);
      return me;
    } finally {
      setLoading(false);
    }
  }, [authFetch, token]);

  const updateProfile = useCallback(
    async (payload) => {
      const me = await authFetch(`${API_BASE}/auth/me`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setUser(me);
      return me;
    },
    [authFetch],
  );

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchMe().catch(() => logout());
  }, [token, fetchMe, logout]);

  const avatarFallback = useMemo(
    () => getInitial(user?.username),
    [user?.username],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      avatarFallback,
      authFetch,
      requestRegisterOtp,
      verifyRegisterOtp,
      register,
      login,
      loginWithGoogle,
      updateProfile,
      fetchMe,
      logout,
    }),
    [
      token,
      user,
      loading,
      avatarFallback,
      authFetch,
      requestRegisterOtp,
      verifyRegisterOtp,
      register,
      login,
      loginWithGoogle,
      updateProfile,
      fetchMe,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
