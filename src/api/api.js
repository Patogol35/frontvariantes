// =====================
// BASE URL
// =====================
const BASE_URL = import.meta.env.VITE_API_URL;

// 🔥 DEBUG BASE URL
console.log("BASE URL:", BASE_URL);

// =====================
// REFRESH TOKEN
// =====================
export const refreshToken = async (refresh) => {
  console.log("REFRESH TOKEN CALL");

  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  console.log("REFRESH STATUS:", res.status);

  if (!res.ok) throw new Error("No se pudo refrescar el token");

  const data = await res.json();
  console.log("REFRESH RESPONSE:", data);

  return data;
};

// =====================
// FETCH CON AUTO REFRESH
// =====================
async function authFetch(url, options = {}, token) {
  let headers = {
    ...(options.headers || {}),
    ...(options.body && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.log("====================================");
  console.log("URL:", url);
  console.log("METHOD:", options.method);
  console.log("BODY:", options.body);
  console.log("TOKEN:", token);

  let res;

  try {
    res = await fetch(url, { ...options, headers });
  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    throw new Error("No se pudo conectar con el servidor");
  }

  console.log("STATUS:", res.status);

  // 🔥 Auto-refresh del token
  if (res.status === 401 && localStorage.getItem("refresh")) {
    console.warn("🔄 Intentando refresh token...");

    try {
      const newTokens = await refreshToken(localStorage.getItem("refresh"));

      if (newTokens?.access) {
        localStorage.setItem("access", newTokens.access);
        token = newTokens.access;

        headers = {
          ...(options.headers || {}),
          ...(options.body && { "Content-Type": "application/json" }),
          Authorization: `Bearer ${token}`,
        };

        res = await fetch(url, { ...options, headers });

        console.log("RETRY STATUS:", res.status);
      }
    } catch (err) {
      console.error("❌ Refresh token inválido:", err);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      throw new Error("⚠️ Tu sesión expiró, vuelve a iniciar sesión.");
    }
  }

  const text = await res.text();
  console.log("RAW RESPONSE:", text);

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    console.warn("⚠️ No es JSON válido");
    data = null;
  }

  if (!res.ok) {
    const error = new Error("Error en la petición");
    error.response = { data };
    console.error("❌ ERROR RESPONSE:", data);
    throw error;
  }

  return data;
}

// =====================
// AUTH
// =====================
export const login = async (credentials) => {
  return authFetch(`${BASE_URL}/token/`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const register = async (data) => {
  return authFetch(`${BASE_URL}/register/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// =====================
// PRODUCTOS
// =====================
export const getProductos = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${BASE_URL}/productos/?${query}`
    : `${BASE_URL}/productos/`;

  return authFetch(url, { method: "GET" });
};

// =====================
// CATEGORÍAS
// =====================
export const getCategorias = async () => {
  return authFetch(`${BASE_URL}/categorias/`, { method: "GET" });
};

// =====================
// 🛒 CARRITO
// =====================
export const agregarAlCarrito = async (
  producto_id,
  cantidad = 1,
  token,
  variante_id = null
) => {
  return authFetch(
    `${BASE_URL}/carrito/agregar/`,
    {
      method: "POST",
      body: JSON.stringify({
        producto_id,
        cantidad,
        variante_id,
      }),
    },
    token
  );
};

export const getCarrito = async (token) => {
  return authFetch(`${BASE_URL}/carrito/`, { method: "GET" }, token);
};

export const eliminarDelCarrito = async (itemId, token) => {
  return authFetch(
    `${BASE_URL}/carrito/eliminar/${itemId}/`,
    { method: "DELETE" },
    token
  );
};

export const setCantidadItem = async (itemId, cantidad, token) => {
  return authFetch(
    `${BASE_URL}/carrito/actualizar/${itemId}/`,
    {
      method: "PUT",
      body: JSON.stringify({ cantidad }),
    },
    token
  );
};

// =====================
// 📦 PEDIDOS
// =====================
export const crearPedido = async (token) => {
  return authFetch(`${BASE_URL}/pedido/crear/`, { method: "POST" }, token);
};

export const getPedidos = async (token, page = 1) => {
  return authFetch(
    `${BASE_URL}/pedidos/?page=${page}`,
    { method: "GET" },
    token
  );
};

// =====================
// 👤 PERFIL
// =====================
export const getUserProfile = async (token) => {
  return authFetch(`${BASE_URL}/user/profile/`, { method: "GET" }, token);
};