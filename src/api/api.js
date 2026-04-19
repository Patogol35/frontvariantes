// =====================
// BASE URL
// =====================
const BASE_URL = import.meta.env.VITE_API_URL;

// =====================
// REFRESH TOKEN
// =====================
export const refreshToken = async (refresh) => {
  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("No se pudo refrescar el token");

  return await res.json();
};

// =====================
// FETCH CON AUTH
// =====================
async function authFetch(url, options = {}, token) {
  let headers = {
    ...(options.headers || {}),
    ...(options.body && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res = await fetch(url, { ...options, headers });

  // 🔄 refresh token automático
  if (res.status === 401 && localStorage.getItem("refresh")) {
    try {
      const newTokens = await refreshToken(localStorage.getItem("refresh"));

      localStorage.setItem("access", newTokens.access);
      token = newTokens.access;

      headers.Authorization = `Bearer ${token}`;

      res = await fetch(url, { ...options, headers });
    } catch {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      throw new Error("Sesión expirada");
    }
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error("Error en la petición");
    error.response = { data };
    throw error;
  }

  return data;
}

// =====================
// AUTH
// =====================
export const login = (credentials) =>
  authFetch(`${BASE_URL}/token/`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const register = (data) =>
  authFetch(`${BASE_URL}/register/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// =====================
// PRODUCTOS
// =====================
export const getProductos = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${BASE_URL}/productos/?${query}`
    : `${BASE_URL}/productos/`;

  return authFetch(url);
};

export const getCategorias = () =>
  authFetch(`${BASE_URL}/categorias/`);

// =====================
// 🛒 CARRITO (🔥 FIX)
// =====================

// 🔥 CORRECTO
export const agregarAlCarrito = (
  producto_id,
  variante_id = null,
  cantidad = 1,
  token
) =>
  authFetch(
    `${BASE_URL}/carrito/agregar/`,
    {
      method: "POST",
      body: JSON.stringify({
        producto_id,
        variante_id,
        cantidad,
      }),
    },
    token
  );

export const getCarrito = (token) =>
  authFetch(`${BASE_URL}/carrito/`, {}, token);

export const eliminarDelCarrito = (itemId, token) =>
  authFetch(
    `${BASE_URL}/carrito/eliminar/${itemId}/`,
    { method: "DELETE" },
    token
  );

export const setCantidadItem = (itemId, cantidad, token) =>
  authFetch(
    `${BASE_URL}/carrito/actualizar/${itemId}/`,
    {
      method: "PUT",
      body: JSON.stringify({ cantidad }),
    },
    token
  );

// =====================
// 📦 PEDIDOS
// =====================
export const crearPedido = (token) =>
  authFetch(`${BASE_URL}/pedido/crear/`, { method: "POST" }, token);

export const getPedidos = (token, page = 1) =>
  authFetch(
    `${BASE_URL}/pedidos/?page=${page}`,
    {},
    token
  );

// =====================
// 👤 PERFIL
// =====================
export const getUserProfile = (token) =>
  authFetch(`${BASE_URL}/user/profile/`, {}, token);
