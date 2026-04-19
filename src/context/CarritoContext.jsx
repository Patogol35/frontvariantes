import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  agregarAlCarrito as apiAgregar,
  getCarrito as apiGetCarrito,
  eliminarDelCarrito as apiEliminar,
  setCantidadItem as apiSetCantidad,
} from "../api/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const { access } = useAuth();
  const [carrito, setCarrito] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const cargarCarrito = async () => {
    if (!access) {
      setCarrito({ items: [] });
      return;
    }

    setLoading(true);
    try {
      const data = await apiGetCarrito(access);
      setCarrito(data);
    } catch (e) {
      console.error(e);
      setCarrito({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCarrito();
  }, [access]);

  // =====================
  // 🔥 ACTUALIZAR CANTIDAD
  // =====================
  const setCantidad = async (itemId, cantidad) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    if (cantidad < 1) return;

    try {
      const res = await apiSetCantidad(itemId, cantidad, access);
      const cantidadFinal = res?.cantidad ?? cantidad;

      setCarrito((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === itemId
            ? {
                ...it,
                cantidad: cantidadFinal,
                subtotal: cantidadFinal * it.producto.precio,
              }
            : it
        ),
      }));
    } catch (e) {
      console.error(e);
      toast.error(
        e?.response?.data?.error || e.message || "No se pudo actualizar la cantidad"
      );
    }
  };

  // =====================
  // 🔥 AGREGAR AL CARRITO (FIX VARIANTES)
  // =====================
  const agregarAlCarrito = async (
    producto_id,
    cantidad = 1,
    variante_id = null
  ) => {
    if (!access) throw new Error("Debes iniciar sesión.");

    try {
      const nuevoItem = await apiAgregar(
        producto_id,
        cantidad,
        access,
        variante_id // 🔥 AQUÍ ESTÁ EL FIX
      );

      setCarrito((prev) => {
        // 🔥 clave: evitar duplicados (producto + variante)
        const items = prev.items.filter(
          (it) =>
            !(
              it.producto.id === nuevoItem.producto.id &&
              (it.variante?.id || null) === (nuevoItem.variante?.id || null)
            )
        );

        return { ...prev, items: [...items, nuevoItem] };
      });

      toast.success("Producto agregado 🛒");
    } catch (e) {
      console.error(e);
      toast.error(
        e?.response?.data?.error || e.message || "No se pudo agregar el producto"
      );
      throw e;
    }
  };

  // =====================
  // ❌ ELIMINAR
  // =====================
  const eliminarItem = async (itemId) => {
    if (!access) throw new Error("Debes iniciar sesión.");

    try {
      await apiEliminar(itemId, access);

      setCarrito((prev) => ({
        ...prev,
        items: prev.items.filter((it) => it.id !== itemId),
      }));

      toast.warn("Producto eliminado 🗑️");
    } catch (e) {
      console.error(e);
      toast.error(
        e?.response?.data?.error || e.message || "No se pudo eliminar el producto"
      );
    }
  };

  // =====================
  // 🧹 LIMPIAR LOCAL
  // =====================
  const limpiarLocal = () => setCarrito({ items: [] });

  const value = useMemo(
    () => ({
      carrito,
      items: carrito.items || [],
      loading,
      cargarCarrito,
      agregarAlCarrito,
      setCantidad,
      eliminarItem,
      limpiarLocal,
    }),
    [carrito, loading]
  );

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
