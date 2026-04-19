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

  const setCantidad = async (itemId, cantidad) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    if (cantidad < 1) return;

    try {
      const res = await apiSetCantidad(itemId, cantidad, access);

      setCarrito((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === itemId
            ? { ...it, cantidad: res.cantidad }
            : it
        ),
      }));
    } catch (e) {
      toast.error(e?.response?.data?.error || "Error al actualizar");
    }
  };

  // 🔥 AHORA CON VARIANTE
  const agregarAlCarrito = async (producto_id, variante_id, cantidad = 1) => {
    if (!access) throw new Error("Debes iniciar sesión.");

    try {
      const nuevoItem = await apiAgregar(producto_id, variante_id, cantidad, access);

      setCarrito((prev) => {
        const items = prev.items.filter((it) => it.id !== nuevoItem.id);
        return { ...prev, items: [...items, nuevoItem] };
      });
    } catch (e) {
      throw new Error(
        e?.response?.data?.error || "No se pudo agregar el producto"
      );
    }
  };

  const eliminarItem = async (itemId) => {
    await apiEliminar(itemId, access);
    setCarrito((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== itemId),
    }));
  };

  const limpiarLocal = () => setCarrito({ items: [] });

  const value = useMemo(
    () => ({
      items: carrito.items || [],
      loading,
      agregarAlCarrito,
      setCantidad,
      eliminarItem,
      limpiarLocal,
      cargarCarrito,
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
