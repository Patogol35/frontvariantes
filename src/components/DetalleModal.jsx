import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useState, useEffect, useMemo } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import detalleModalStyles from "./DetalleModal.styles";
import { botonAgregarSx } from "../components/ProductoCard.styles";

export default function DetalleProducto({
  producto,
  setLightbox,
  modo = "compra",
  setModo,
  onBack, // 🔥 opcional (para volver)
}) {
  const { agregarAlCarrito } = useCarrito();
  const { isAuthenticated } = useAuth();

  const [imagenActiva, setImagenActiva] = useState("");
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);

  if (!producto) return null;

  // 🖼 IMÁGENES
  const imagenes = useMemo(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      return varianteSeleccionada.imagenes.map((img) => img.imagen);
    }

    const imgs = [
      producto.imagen,
      ...(producto.imagenes?.map((img) => img.imagen) || []),
    ].filter(Boolean);

    return [...new Set(imgs)];
  }, [producto, varianteSeleccionada]);

  // 📦 STOCK
  const stockTotal = useMemo(() => {
    if (!producto.variantes?.length) return 1;
    return producto.variantes.reduce(
      (acc, v) => acc + (v.stock || 0),
      0
    );
  }, [producto]);

  useEffect(() => {
    if (modo === "compra") {
      setVarianteSeleccionada(null);
    }
  }, [modo]);

  useEffect(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      setImagenActiva(varianteSeleccionada.imagenes[0].imagen);
    } else {
      setImagenActiva(imagenes[0] || "");
    }
  }, [varianteSeleccionada, imagenes]);

  const imagenSegura = imagenActiva || imagenes[0] || "/placeholder.png";

  const tieneVariantes = producto.variantes?.length > 0;
  const tieneStockVariantes = producto.variantes?.some(
    (v) => v.stock > 0
  );

  const precioActual =
    varianteSeleccionada?.precio ?? producto.precio;

  const handleAgregar = async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión");
      return;
    }

    if (tieneVariantes && !varianteSeleccionada) {
      toast.error("Selecciona una variante");
      return;
    }

    try {
      await agregarAlCarrito(
        producto.id,
        varianteSeleccionada?.id || null,
        1
      );

      toast.success("Producto agregado ✅");
    } catch (e) {
      toast.error(e.message || "Error");
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
      
      {/* 🔙 BOTÓN ATRÁS */}
      <IconButton onClick={onBack}>
        <ArrowBackIcon />
      </IconButton>

      <Stack spacing={3} alignItems="center">

        {/* IMAGEN */}
        <Box
          sx={detalleModalStyles.sliderBox}
          onClick={() => setLightbox && setLightbox(imagenSegura)}
        >
          <Box
            component="img"
            src={imagenSegura}
            alt={producto.nombre}
            sx={detalleModalStyles.imagen}
          />
        </Box>

        {/* PRECIO */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <AttachMoneyIcon color="success" />
          <Typography variant="h5" fontWeight="bold" color="success.main">
            {precioActual}
          </Typography>
        </Stack>

        {/* MINIATURAS */}
        {imagenes.length > 1 && (
          <Stack direction="row" spacing={1}>
            {imagenes.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                onClick={() => setImagenActiva(img)}
                sx={{
                  width: 55,
                  height: 55,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                  border: imagenSegura === img
                    ? "2px solid #1976d2"
                    : "1px solid #ddd",
                }}
              />
            ))}
          </Stack>
        )}

        {/* INFO */}
        <Box textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            {producto.nombre}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            {producto.descripcion}
          </Typography>
        </Box>

        {/* VARIANTES */}
        {tieneVariantes && modo === "compra" && (
          <Stack spacing={2} alignItems="center">

            <Typography fontWeight="bold">
              Selecciona una opción:
            </Typography>

            {!tieneStockVariantes && (
              <Chip label="Sin stock" color="error" />
            )}

            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {producto.variantes.map((v) => {
                const isSelected = varianteSeleccionada?.id === v.id;

                const label = [
                  v.talla,
                  v.color,
                  v.modelo,
                  v.capacidad,
                ]
                  .filter(Boolean)
                  .join(" - ");

                return (
                  <Button
                    key={v.id}
                    onClick={() => setVarianteSeleccionada(v)}
                    disabled={v.stock === 0}
                    sx={{
                      borderRadius: "999px",
                      backgroundColor: isSelected ? "#111" : "#fff",
                      color: isSelected ? "#fff" : "#333",
                    }}
                  >
                    {label || "Única"}
                  </Button>
                );
              })}
            </Stack>

            {varianteSeleccionada && (
              <Chip
                label={`Stock: ${varianteSeleccionada.stock}`}
                color="success"
              />
            )}
          </Stack>
        )}

        {/* BOTÓN */}
        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAgregar}
          sx={{
            ...botonAgregarSx(stockTotal),
            maxWidth: 400,
            width: "100%",
          }}
        >
          Agregar al carrito
        </Button>

      </Stack>
    </Box>
  );
}
