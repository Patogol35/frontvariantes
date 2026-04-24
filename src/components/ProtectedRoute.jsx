import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();

  // 🚫 Espera a que auth esté listo
  if (!isReady) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
