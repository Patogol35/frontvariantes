import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserProfile } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar tokens al iniciar
  useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");

    if (savedAccess) setAccess(savedAccess);
    if (savedRefresh) setRefresh(savedRefresh);

    // ⚠️ No quitamos loading aquí, esperamos el perfil
  }, []);

  // 🔹 Obtener perfil cuando hay access
  useEffect(() => {
    const fetchProfile = async () => {
      if (!access) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(access);
        setUser(data);
      } catch (err) {
        console.error("Error obteniendo perfil:", err);

        // 🔥 si falla el token, limpiamos todo
        setAccess(null);
        setRefresh(null);
        setUser(null);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } finally {
        setLoading(false); // 🔥 SIEMPRE termina loading
      }
    };

    fetchProfile();
  }, [access]);

  // 🔹 Estado derivado
  const isAuthenticated = !!access;

  // 🔹 Login
  const login = (accessToken, refreshToken) => {
    setLoading(true);

    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);

    setAccess(accessToken);
    setRefresh(refreshToken);
    // el perfil se carga automáticamente después
  };

  // 🔹 Logout
  const logout = () => {
    setLoading(true); // 🔥 bloquea UI para evitar flicker

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setAccess(null);
    setRefresh(null);
    setUser(null);

    setLoading(false); // 🔥 desbloquea
  };

  const value = useMemo(
    () => ({
      access,
      refresh,
      user,
      isAuthenticated,
      loading,
      login,
      logout,
    }),
    [access, refresh, user, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
