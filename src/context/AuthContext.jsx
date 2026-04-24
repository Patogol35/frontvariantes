import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserProfile } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [user, setUser] = useState(null);

  // 🔥 estado real
  const [status, setStatus] = useState("loading");
  // "loading" | "authenticated" | "guest" | "loggingOut"

  // Recuperar tokens
  useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");

    if (savedAccess) {
      setAccess(savedAccess);
      setRefresh(savedRefresh);
      setStatus("authenticated");
    } else {
      setStatus("guest");
    }
  }, []);

  // Obtener perfil
  useEffect(() => {
    const fetchProfile = async () => {
      if (access) {
        try {
          const data = await getUserProfile(access);
          setUser(data);
        } catch (err) {
          console.error("Error obteniendo perfil:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchProfile();
  }, [access]);

  // 🔥 LOGIN
  const login = (accessToken, refreshToken) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);

    setAccess(accessToken);
    setRefresh(refreshToken);
    setStatus("authenticated");
  };

  // 🔥 LOGOUT (CLAVE)
  const logout = () => {
    setStatus("loggingOut"); // 👈 evita flicker

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setAccess(null);
    setRefresh(null);
    setUser(null);

    setStatus("guest");
  };

  const value = useMemo(
    () => ({
      access,
      refresh,
      user,
      login,
      logout,
      status, // 👈 IMPORTANTE
    }),
    [access, refresh, user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
