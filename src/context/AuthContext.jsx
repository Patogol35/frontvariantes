import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserProfile } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Recuperar tokens al cargar
  useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");

    if (savedAccess) setAccess(savedAccess);
    if (savedRefresh) setRefresh(savedRefresh);

    // 👇 IMPORTANTE: si no hay tokens, deja de cargar aquí
    if (!savedAccess) setLoading(false);
  }, []);

  // 🔹 Obtener perfil cada vez que cambia access
  useEffect(() => {
    const fetchProfile = async () => {
      // 👇 CLAVE: activar loading en cada cambio
      setLoading(true);

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

      setLoading(false);
    };

    fetchProfile();
  }, [access]);

  const isAuthenticated = !!access;

  const login = (accessToken, refreshToken) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);

    setAccess(accessToken);
    setRefresh(refreshToken);
    // 👇 loading se manejará automáticamente en el useEffect
  };

  const logout = () => {
    setLoading(true); // 👈 mejora visual (evita flash)

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setAccess(null);
    setRefresh(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      access,
      refresh,
      isAuthenticated,
      user,
      login,
      logout,
      loading,
    }),
    [access, refresh, isAuthenticated, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
