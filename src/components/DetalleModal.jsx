import {
  Box,
  Typography,
  Stack,
  IconButton,
  Chip,
  Dialog,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useMemo } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import detalleModalStyles from "./DetalleModal.styles";

export default function DetalleModal({
  producto,
  open,
  onClose,
  setLightbox,
}) {
  const { agregarAlCarrito } = useCarrito();
  const { isAuthenticated } = useAuth();

  if (!producto) return null;

  // =========================
  // 🖼 IMÁGENES
  // =========================
  const imagenes = useMemo(() => {
    const imgs = [
      producto.imagen,
      ...(Array.isArray(producto.imagenes) ? producto.imagenes : []),
    ]
      .map((img) => (typeof img === "string" ? img : img?.imagen))
      .filter(Boolean);

    return [...new Set(imgs)];
  }, [producto]);

  const [imagenActiva, setImagenActiva] = useState("");
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);

  useEffect(() => {
    if (open) {
      setImagenActiva(imagenes[0] || "");
      setVarianteSeleccionada(null);
    }
  }, [open, imagenes]);

  const imagenSegura = imagenActiva || imagenes[0] || "";

  const tieneVariantes =
    producto.variantes && producto.variantes.length > 0;

  // =========================
  // 🛒 AGREGAR
  // =========================
  const handleAgregar = async () => {
    if (!isAuthenticated) {
      toast.warn("Debes iniciar sesión");
      return;
    }

    if (tieneVariantes && !varianteSeleccionada) {
      toast.error("Selecciona talla o color");
      return;
    }

    try {
      await agregarAlCarrito(
        producto.id,
        1,
        varianteSeleccionada?.id || null // 🔥 CLAVE
      );

      toast.success("Producto agregado ✅");
      onClose();
    } catch (e) {
      toast.error(e.message);
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
        {imagenSegura ? (
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
        ) : (
          <Typography>No hay imagen</Typography>
        )}

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
                  cursor: "pointer",
                  border:
                    imagenSegura === img
                      ? "2px solid #1976d2"
                      : "1px solid #777",
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

          <Typography>{producto.descripcion}</Typography>
        </Box>

        {/* =========================
            🔥 VARIANTES
        ========================= */}
        {tieneVariantes && (
          <Stack spacing={1} alignItems="center">
            <Typography fontWeight="bold">
              Selecciona variante:
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {producto.variantes.map((v) => (
                <Button
                  key={v.id}
                  variant={
                    varianteSeleccionada?.id === v.id
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => setVarianteSeleccionada(v)}
                  disabled={v.stock === 0}
                >
                  {v.talla || ""} {v.color || ""}
                </Button>
              ))}
            </Stack>
          </Stack>
        )}

        {/* BOTÓN */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleAgregar}
        >
          Agregar al carrito
        </Button>
      </Stack>
    </Dialog>
  );
}