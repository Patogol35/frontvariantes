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
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [colorSeleccionado, setColorSeleccionado] = useState(null);

  // 🔥 obtener variantes
  const variantes = producto.variantes || [];

  // 🔥 tallas únicas
  const tallas = [...new Set(variantes.map((v) => v.talla))];

  // 🔥 colores según talla
  const colores = useMemo(() => {
    if (!tallaSeleccionada) return [];
    return [
      ...new Set(
        variantes
          .filter((v) => v.talla === tallaSeleccionada)
          .map((v) => v.color)
      ),
    ];
  }, [tallaSeleccionada, variantes]);

  // 🔥 variante seleccionada final
  const varianteSeleccionada = useMemo(() => {
    return variantes.find(
      (v) =>
        v.talla === tallaSeleccionada &&
        v.color === colorSeleccionado
    );
  }, [tallaSeleccionada, colorSeleccionado, variantes]);

  // 🔥 imágenes dinámicas
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

  // reset
  useEffect(() => {
    if (open) {
      setTallaSeleccionada(null);
      setColorSeleccionado(null);
    }
  }, [open]);

  // imagen activa
  useEffect(() => {
    if (imagenes.length > 0) {
      setImagenActiva(imagenes[0]);
    }
  }, [imagenes]);

  const imagenSegura = imagenActiva || "/placeholder.png";

  const stockDisponible = varianteSeleccionada?.stock || 0;

  // 🛒 agregar
  const handleAgregar = async () => {
    if (!isAuthenticated) {
      toast.warn("Debes iniciar sesión");
      return;
    }

    if (!varianteSeleccionada) {
      toast.error("Selecciona talla y color");
      return;
    }

    try {
      await agregarAlCarrito(
        producto.id,
        varianteSeleccionada.id,
        1
      );
      toast.success("Producto agregado ✅");
      onClose();
    } catch (e) {
      toast.error(e.message || "Error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={detalleModalStyles.dialog}
      PaperProps={{ sx: detalleModalStyles.dialogPaper }}
    >
      {/* cerrar */}
      <IconButton onClick={onClose} sx={detalleModalStyles.botonCerrar}>
        <CloseIcon />
      </IconButton>

      <Stack spacing={3} alignItems="center">
        {/* imagen */}
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

        {/* miniaturas */}
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
                  border:
                    imagenSegura === img
                      ? "2px solid #1976d2"
                      : "1px solid #777",
                }}
              />
            ))}
          </Stack>
        )}

        {/* info */}
        <Box textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            {producto.nombre}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            {producto.descripcion}
          </Typography>
        </Box>

        {/* TALLAS */}
        <Stack spacing={1} alignItems="center">
          <Typography fontWeight="bold">Talla</Typography>

          <Stack direction="row" gap={1}>
            {tallas.map((t) => (
              <Button
                key={t}
                variant={tallaSeleccionada === t ? "contained" : "outlined"}
                onClick={() => {
                  setTallaSeleccionada(t);
                  setColorSeleccionado(null);
                }}
              >
                {t}
              </Button>
            ))}
          </Stack>
        </Stack>

        {/* COLORES */}
        {tallaSeleccionada && (
          <Stack spacing={1} alignItems="center">
            <Typography fontWeight="bold">Color</Typography>

            <Stack direction="row" gap={1}>
              {colores.map((c) => (
                <Button
                  key={c}
                  variant={colorSeleccionado === c ? "contained" : "outlined"}
                  onClick={() => setColorSeleccionado(c)}
                  sx={{ textTransform: "none" }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: c?.toLowerCase(),
                      mr: 1,
                    }}
                  />
                  {c}
                </Button>
              ))}
            </Stack>
          </Stack>
        )}

        {/* STOCK */}
        {varianteSeleccionada && (
          <Chip
            label={`Stock: ${stockDisponible}`}
            color={stockDisponible > 0 ? "success" : "default"}
          />
        )}

        {/* BOTÓN */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAgregar}
            sx={{
              ...botonAgregarSx(stockDisponible),
              maxWidth: 400,
              width: "100%",
            }}
            disabled={!varianteSeleccionada || stockDisponible === 0}
          >
            {!tallaSeleccionada || !colorSeleccionado
              ? "Seleccionar opciones"
              : stockDisponible > 0
              ? "Agregar al carrito"
              : "Agotado"}
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
            }
