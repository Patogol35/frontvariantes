import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import {
  Card,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InfoIcon from "@mui/icons-material/Info";
import StarIcon from "@mui/icons-material/Star";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import {
  cardSx,
  imagenBoxSx,
  imagenSx,
  chipNuevoSx,
  contenidoSx,
  tituloSx,
  precioStackSx,
  dividerSx,
  botonAgregarSx,
  botonDetallesSx,
} from "./ProductoCard.styles";

export default function ProductoCard({ producto, onVerDetalle, onAgregar }) {
  const { isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  // 🖼 IMÁGENES
  const imagenes = useMemo(() => {
    const imgs = [
      producto.imagen,
      ...(producto.imagenes?.map((img) => img.imagen) || []),
    ].filter(Boolean);

    return [...new Set(imgs)];
  }, [producto]);

  const [imagenActiva, setImagenActiva] = useState(imagenes[0] || "");

  // 📦 STOCK
  const stockTotal = useMemo(() => {
    if (!producto.variantes || producto.variantes.length === 0) return 1;
    return producto.variantes.reduce((acc, v) => acc + (v.stock || 0), 0);
  }, [producto]);

  const tieneVariantes = producto.variantes?.length > 0;

  const tieneStockVariantes = producto.variantes?.some(
    (v) => v.stock > 0
  );

  // 💰 PRECIO DINÁMICO
  const precioMinimo = useMemo(() => {
    if (!tieneVariantes) return producto.precio;

    const precios = producto.variantes
      .map((v) => v.precio)
      .filter(Boolean);

    return precios.length > 0
      ? Math.min(...precios)
      : producto.precio;
  }, [producto, tieneVariantes]);

  // 🛒 AGREGAR / SELECCIONAR
  const onAdd = async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar productos");
      navigate("/login");
      return;
    }

    // 🔥 SI TIENE VARIANTES → ABRIR MODAL EN MODO COMPRA
    if (tieneVariantes) {
      toast.info("Selecciona opciones 👇");

      if (onVerDetalle) {
        onVerDetalle(producto, "compra"); // 👈 CLAVE
      } else {
        navigate(`/producto/${producto.id}`, {
          state: { producto },
        });
      }
      return;
    }

    // 🔥 SIN VARIANTES → AGREGA DIRECTO
    if (onAgregar) {
      onAgregar(producto);
      return;
    }

    try {
      await agregarAlCarrito(producto.id, null, 1);
      toast.success(`${producto.nombre} agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message || "Error al agregar");
    }
  };

  return (
    <Card sx={cardSx} elevation={0}>
      {/* IMAGEN */}
      <Box sx={imagenBoxSx}>
        <Box
          component="img"
          src={imagenActiva || "/placeholder.png"}
          alt={producto.nombre}
          sx={imagenSx}
        />

        {producto.nuevo && (
          <Chip
            icon={<StarIcon />}
            label="Nuevo"
            color="secondary"
            size="small"
            sx={chipNuevoSx}
          />
        )}
      </Box>

      {/* MINIATURAS */}
      {imagenes.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ px: 1, mt: 1, justifyContent: "center" }}
        >
          {imagenes.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              alt={`img-${i}`}
              onClick={() => setImagenActiva(img)}
              sx={{
                width: 45,
                height: 45,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                border:
                  imagenActiva === img
                    ? "2px solid #1976d2"
                    : "1px solid #999",
              }}
            />
          ))}
        </Stack>
      )}

      {/* CONTENIDO */}
      <Box sx={contenidoSx}>
        <Typography variant="h6" fontWeight="bold" sx={tituloSx}>
          {producto.nombre}
        </Typography>

        {/* 💰 PRECIO */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={precioStackSx}
        >
          <MonetizationOnIcon color="primary" />
          <Typography variant="h6" color="primary" fontWeight="bold">
            {tieneVariantes ? `Desde $${precioMinimo}` : `$${producto.precio}`}
          </Typography>
        </Stack>

        <Divider sx={dividerSx} />

        {/* BOTONES */}
        <Stack spacing={1}>
          {/* 🟢 BOTÓN PRINCIPAL */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddShoppingCartIcon />}
            sx={botonAgregarSx(stockTotal)}
            onClick={onAdd}
            disabled={
              tieneVariantes
                ? !tieneStockVariantes
                : stockTotal === 0
            }
          >
            {tieneVariantes
              ? tieneStockVariantes
                ? "Seleccionar opciones"
                : "Agotado"
              : stockTotal > 0
              ? "Agregar al carrito"
              : "Agotado"}
          </Button>

          {/* 🔵 BOTÓN DETALLES */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<InfoIcon />}
            sx={botonDetallesSx}
            onClick={() =>
              onVerDetalle
                ? onVerDetalle(producto, "info") // 👈 CLAVE
                : navigate(`/producto/${producto.id}`, {
                    state: { producto },
                  })
            }
          >
            Ver detalles
          </Button>
        </Stack>
      </Box>
    </Card>
  );
        }
