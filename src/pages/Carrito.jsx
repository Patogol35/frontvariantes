import { useEffect, useMemo } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  Typography,
  Box,
  Divider,
  Button,
  useTheme,
} from "@mui/material";

import CarritoItem from "../components/CarritoItem";
import { calcularSubtotal } from "../utils/carritoUtils";
import styles from "./Carrito.styles";

export default function Carrito() {
  const theme = useTheme();
  const {
    items,
    cargarCarrito,
    loading,
    limpiarLocal,
    setCantidad,
    eliminarItem,
  } = useCarrito();

  const { access } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  // =========================
  // 💰 TOTAL
  // =========================
  const total = useMemo(
    () => items.reduce((acc, it) => acc + calcularSubtotal(it), 0),
    [items]
  );

  // =========================
  // 🛒 COMPRAR
  // =========================
  const comprar = async () => {
    try {
      const res = await crearPedido(access);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Pedido realizado ✅");
      limpiarLocal();
      navigate("/pedidos");
    } catch (e) {
      toast.error(e.message || "Ocurrió un error en la compra");
    }
  };

  // =========================
  // 🔼 INCREMENTAR (🔥 FIX VARIANTES)
  // =========================
  const incrementar = (it) => {
    const stock = it.variante
      ? it.variante.stock
      : 999; // producto sin variantes

    if (it.cantidad < stock) {
      setCantidad(it.id, it.cantidad + 1);
    } else {
      toast.warning(`Solo hay ${stock} unidades disponibles`);
    }
  };

  // =========================
  // 🔽 DECREMENTAR
  // =========================
  const decrementar = (it) => {
    if (it.cantidad > 1) {
      setCantidad(it.id, it.cantidad - 1);
    }
  };

  return (
    <Box sx={styles.root}>
      {/* HEADER */}
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        align="center"
        sx={styles.header}
      >
        <ShoppingCartIcon color="primary" sx={styles.headerIcon} />
        Mi Carrito
      </Typography>

      {/* LOADING */}
      {loading && <Typography>Cargando carrito...</Typography>}

      {/* VACÍO */}
{!loading && items.length === 0 && (
  <Box sx={styles.emptyState}>
    <Typography
      variant="h6"
      sx={styles.emptyTitle(theme)}
    >
      Tu carrito está vacío
    </Typography>

    <Typography
      variant="body2"
      sx={styles.emptySubtitle(theme)}
    >
      Agrega productos para comenzar tu compra
    </Typography>
  </Box>
)}

      {/* ITEMS */}
      {!loading &&
        items.map((it) => (
          <CarritoItem
            key={it.id}
            it={it}
            theme={theme}
            incrementar={incrementar}
            decrementar={decrementar}
            setCantidad={setCantidad}
            eliminarItem={eliminarItem}
          />
        ))}

      {/* FOOTER */}
      {!loading && items.length > 0 && (
        <Box sx={styles.footerBox(theme)}>
          <Divider sx={styles.divider} />

          <Typography variant="h6" sx={styles.total(theme)}>
            <MonetizationOnIcon fontSize="small" />
            Total: {total.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            startIcon={<ShoppingCartCheckoutIcon />}
            sx={styles.button(theme)}
            onClick={comprar}
          >
            Finalizar compra
          </Button>
        </Box>
      )}
    </Box>
  );
}
