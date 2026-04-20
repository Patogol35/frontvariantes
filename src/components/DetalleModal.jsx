import {
  Box,
  Typography,
  Stack,
  IconButton,
  Dialog,
  Button,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useState, useEffect, useMemo } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import detalleModalStyles from "./DetalleModal.styles";
import { botonAgregarSx } from "../components/ProductoCard.styles";

export default function DetalleModal({
  producto,
  open,
  onClose,
  setLightbox,
  modo = "compra",
  setModo,
}) {
  const { agregarAlCarrito } = useCarrito();
  const { isAuthenticated } = useAuth();

  if (!producto || !open) return null;

  const [imagenActiva, setImagenActiva] = useState("");
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);

  // 🖼 IMÁGENES
  const imagenes = useMemo(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      return varianteSeleccionada.imagenes.map((img) => img.imagen);
    }

    const imgs = [
      producto?.imagen,
      ...(producto?.imagenes?.map((img) => img.imagen) || []),
    ].filter(Boolean);

    return [...new Set(imgs)];
  }, [producto, varianteSeleccionada]);

  // 📦 STOCK
  const stockTotal = useMemo(() => {
    if (!producto?.variantes?.length) return 1;

    return producto.variantes.reduce(
      (acc, v) => acc + (v.stock || 0),
      0
    );
  }, [producto]);

  useEffect(() => {
    if (open && modo === "compra") {
      setVarianteSeleccionada(null);
    }
  }, [open, modo]);

  useEffect(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      setImagenActiva(varianteSeleccionada.imagenes[0].imagen);
    } else {
      setImagenActiva(imagenes[0] || "");
    }
  }, [varianteSeleccionada, imagenes]);

  const imagenSegura = imagenActiva || imagenes[0] || "/placeholder.png";

  const tieneVariantes = producto?.variantes?.length > 0;

  const tieneStockVariantes = producto?.variantes?.some(
    (v) => v.stock > 0
  );

  const precioActual =
    varianteSeleccionada?.precio ?? producto?.precio;

  // 🛒 AGREGAR
  const handleAgregar = async () => {
    try {
      // 🔥 REDIRECCIÓN SEGURA (SIN REACT ROUTER)
      if (!isAuthenticated) {
        toast.error("Debes iniciar sesión");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return;
      }

      if (tieneVariantes && !varianteSeleccionada) {
        toast.error("Selecciona una variante");
        return;
      }

      await agregarAlCarrito(
        producto?.id,
        varianteSeleccionada?.id || null,
        1
      );

      toast.success("Producto agregado ✅");
      onClose && onClose();
    } catch (err) {
      console.error("ERROR MODAL:", err);
      toast.error("Error inesperado");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={detalleModalStyles.dialog}
      PaperProps={{ sx: detalleModalStyles.dialogPaper }}
    >
      <IconButton onClick={onClose} sx={detalleModalStyles.botonCerrar}>
        <CloseIcon />
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
            alt={producto?.nombre}
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
                  borderRadius: 6,
                  cursor: "pointer",
                  border:
                    imagenSegura === img
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
            {producto?.nombre}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            {producto?.descripcion}
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

                const label = [...new Set(
                  [v.talla, v.color, v.modelo, v.capacidad]
                    .filter(Boolean)
                )].join(" - ");

                return (
                  <Button
                    key={v.id}
                    onClick={() => setVarianteSeleccionada(v)}
                    disabled={v.stock === 0}
                    sx={{
                      border: "1px solid #ddd",
                      backgroundColor: isSelected ? "#111" : "#fff",
                      color: isSelected ? "#fff" : "#333",
                    }}
                  >
                    {label || "Única"}
                  </Button>
                );
              })}
            </Stack>
          </Stack>
        )}

        {/* BOTÓN */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {modo === "info" ? (
            <Button
              variant="contained"
              fullWidth
              onClick={() => setModo && setModo("compra")}
            >
              Seleccionar opciones
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAgregar}
              sx={{
                ...botonAgregarSx(stockTotal),
                maxWidth: 400,
                width: "100%",
              }}
              disabled={
                tieneVariantes
                  ? !varianteSeleccionada ||
                    varianteSeleccionada.stock === 0
                  : stockTotal === 0
              }
            >
              Agregar al carrito
            </Button>
          )}
        </Box>
      </Stack>
    </Dialog>
  );
}
