import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Chip,
  Divider,
  Dialog,
  IconButton,
  useTheme,
} from "@mui/material";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";

import {
  containerSx,
  botonVolverSx,
  imagenContainerSx,
  imagenSlideSx,
  imagenSx,
  tituloSx,
  precioSx,
  varianteBtnSx,
  descripcionSx,
  botonAgregarSx,
  stockSx,
  variantesContainerSx,
} from "./ProductoDetalle.styles";

export default function ProductoDetalle() {
  const { state } = useLocation();
  const location = useLocation();
  const producto = state?.producto;
  const { agregarAlCarrito } = useCarrito();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);
useEffect(() => {
    setZoomOpen(false);
  }, [location]);
  
  if (!producto) return <Typography>Producto no encontrado</Typography>;

  const tieneVariantes = producto.variantes?.length > 0;

  const imagenes = useMemo(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      return varianteSeleccionada.imagenes.map((img) => img.imagen);
    }

    const imgs = [
      producto.imagen,
      ...(producto.imagenes?.map((i) => i.imagen) || []),
    ].filter(Boolean);

    return [...new Set(imgs)];
  }, [producto, varianteSeleccionada]);

  const [imagenActiva, setImagenActiva] = useState("");

  useEffect(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      setImagenActiva(varianteSeleccionada.imagenes[0].imagen);
    } else {
      setImagenActiva(imagenes[0] || "");
    }
  }, [varianteSeleccionada, imagenes]);

  const precioActual =
    varianteSeleccionada?.precio ?? producto.precio;

  const stockTotal = useMemo(() => {
    if (!producto.variantes?.length) return producto.stock || 1;
    return producto.variantes.reduce(
      (acc, v) => acc + (v.stock || 0),
      0
    );
  }, [producto]);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión");
      return;
    }

    if (tieneVariantes && !varianteSeleccionada) {
      toast.warning("Selecciona una variante");
      return;
    }

    try {
      await agregarAlCarrito(
        producto.id,
        varianteSeleccionada?.id || null,
        1
      );
      toast.success(`"${producto.nombre}" agregado ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleZoom = (img) => {
    setZoomImage(img);
    setZoomOpen(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <Box sx={containerSx}>
      {/* VOLVER */}
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={botonVolverSx(theme)}
        onClick={() => navigate(-1)}
      >
        Regresar
      </Button>

      {/* 🔥 GRID CENTRADO REAL */}
      <Grid
        container
        spacing={5}
        justifyContent="center"
        alignItems="center"
      >
        {/* IMÁGENES */}
        <Grid item xs={12} md={6}>
          <Box sx={imagenContainerSx(theme)}>
            <Slider {...settings}>
              {imagenes.map((img, i) => (
                <Box
                  key={i}
                  onClick={() => handleZoom(img)}
                  sx={imagenSlideSx}
                >
                  <Box component="img" src={img} sx={imagenSx} />
                </Box>
              ))}
            </Slider>
          </Box>
        </Grid>

        {/* DETALLE */}
        <Grid item xs={12} md={6}>
          {/* 🔥 STACK CENTRADO */}
          <Stack spacing={3} alignItems="center">
            <Typography variant="h4" sx={tituloSx}>
              {producto.nombre}
            </Typography>

            <Typography variant="h5" sx={precioSx(theme)}>
              ${precioActual}
            </Typography>

            {tieneVariantes && (
              <>
                <Typography fontWeight="bold">
                  Selecciona una opción:
                </Typography>

                <Stack direction="row" sx={variantesContainerSx}>
                  {producto.variantes.map((v) => {
                    const isSelected =
                      varianteSeleccionada?.id === v.id;

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
                        sx={varianteBtnSx(isSelected, v.stock, theme)}
                      >
                        {label || "Única"}
                      </Button>
                    );
                  })}
                </Stack>

                {varianteSeleccionada && (
                  <Chip
                    label={`Stock: ${varianteSeleccionada.stock}`}
                    sx={stockSx(varianteSeleccionada.stock)}
                  />
                )}
              </>
            )}

            <Divider sx={{ width: "100%" }} />

            <Typography sx={descripcionSx}>
              {producto.descripcion}
            </Typography>

            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAdd}
              disabled={
                tieneVariantes
                  ? !varianteSeleccionada ||
                    varianteSeleccionada.stock === 0
                  : stockTotal === 0
              }
              sx={botonAgregarSx(
                tieneVariantes
                  ? varianteSeleccionada?.stock
                  : stockTotal
              )}
            >
              {tieneVariantes
                ? varianteSeleccionada
                  ? varianteSeleccionada.stock > 0
                    ? "Agregar al carrito"
                    : "Agotado"
                  : "Seleccionar opción"
                : stockTotal > 0
                ? "Agregar al carrito"
                : "Agotado"}
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* ZOOM */}
      <Dialog
  open={zoomOpen}
  onClose={() => setZoomOpen(false)}
  maxWidth="md"
>
  <Box
    sx={{
      position: "relative",
      bgcolor: theme.palette.background.default, // 🔥 dinámico claro/oscuro
    }}
  >
    {/* BOTÓN X */}
    <IconButton
      onClick={() => setZoomOpen(false)}
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 2,

        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(0,0,0,0.6)"
            : "rgba(255,255,255,0.8)",

        color: theme.palette.text.primary,

        "&:hover": {
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.8)"
              : "rgba(255,255,255,1)",
        },
      }}
    >
      <CloseIcon />
    </IconButton>

    {/* IMAGEN ZOOM */}
    <Box
      component="img"
      src={zoomImage}
      onClick={() => setZoomOpen(false)} // 👈 opcional (click para cerrar)
      sx={{
        maxHeight: "80vh",
        maxWidth: "100%",
        display: "block",
        margin: "0 auto",
        cursor: "zoom-out",
      }}
    />
  </Box>
</Dialog>
    </Box>
  );
              }
