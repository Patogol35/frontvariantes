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
}) {
  const { agregarAlCarrito } = useCarrito();
  const { isAuthenticated } = useAuth();

  if (!producto) return null;

  const [imagenActiva, setImagenActiva] = useState("");
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);

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
    if (open) setVarianteSeleccionada(null);
  }, [open]);

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

  const handleAgregar = async () => {
    if (!isAuthenticated) {
      toast.warn("Debes iniciar sesión");
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
      onClose();
    } catch (e) {
      toast.error(e.message || "Error al agregar");
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
            alt={producto.nombre}
            sx={detalleModalStyles.imagen}
          />
        </Box>

        {/* MINIATURAS */}
        {imagenes.length > 1 && (
          <Stack direction="row" spacing={1}>
            {imagenes.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                onClick={() => setImagenActiva(img)}
                sx={(theme) => ({
                  width: 55,
                  height: 55,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    imagenSegura === img
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                })}
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

        {/* 🔥 VARIANTES */}
        {tieneVariantes && (
          <Stack spacing={2} alignItems="center">
            <Typography fontWeight="bold">
              Selecciona una opción:
            </Typography>

            {!tieneStockVariantes && (
              <Chip label="Sin stock" color="error" />
            )}

            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1.5}
              justifyContent="center"
            >
              {producto.variantes.map((v) => {
                const isSelected = varianteSeleccionada?.id === v.id;

                const label = [...new Set(
                  [v.talla, v.color, v.modelo, v.capacidad]
                    .filter(Boolean)
                    .map((x) => x.trim())
                )].join(" - ");

                return (
                  <Button
                    key={v.id}
                    onClick={() => setVarianteSeleccionada(v)}
                    disabled={v.stock === 0}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontWeight: 500,
                      border: "1px solid #ddd",
                      backgroundColor: isSelected ? "#111" : "#fff",
                      color: isSelected ? "#fff" : "#333",
                      opacity: v.stock === 0 ? 0.4 : 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: isSelected
                          ? "#000"
                          : "#f5f5f5",
                        borderColor: "#999",
                      },
                    }}
                  >
                    {/* 👇 CONTENIDO CON PRECIO */}
                    <Stack spacing={0.2} alignItems="center" lineHeight={1}>
                      <Typography fontSize={13}>
                        {label || "Única"}
                      </Typography>

                      <Typography
                        fontSize={12}
                        fontWeight="bold"
                        sx={{
                          color: isSelected ? "#fff" : "#1976d2",
                        }}
                      >
                        ${v.precio ?? producto.precio}
                      </Typography>
                    </Stack>
                  </Button>
                );
              })}
            </Stack>

            {/* STOCK */}
            {varianteSeleccionada && (
              <Chip
                label={`Stock: ${varianteSeleccionada.stock}`}
                color={
                  varianteSeleccionada.stock > 0
                    ? "success"
                    : "default"
                }
              />
            )}
          </Stack>
        )}

        {/* BOTÓN */}
        <Box
          sx={{
            width: "100%",
            mt: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
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
            {tieneVariantes
              ? varianteSeleccionada
                ? varianteSeleccionada.stock > 0
                  ? "Agregar al carrito"
                  : "Agotado"
                : "Seleccionar opciones"
              : stockTotal > 0
              ? "Agregar al carrito"
              : "Agotado"}
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
                      }
