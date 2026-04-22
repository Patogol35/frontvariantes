import { useState, useEffect, useRef } from "react";
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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
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
  const sliderRef = useRef(null);

  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);
  const [imagenes, setImagenes] = useState([]);

  if (!producto) return <Typography>Producto no encontrado</Typography>;

  const tieneVariantes = producto.variantes?.length > 0;

  // 🔥 FIX DEFINITIVO DE IMÁGENES
  useEffect(() => {
    let imgs = [];

    if (varianteSeleccionada?.imagenes?.length > 0) {
      imgs = varianteSeleccionada.imagenes
        .map((img) => img.imagen)
        .filter((url) => typeof url === "string" && url.trim() !== "");
    } else {
      imgs = [
        producto.imagen,
        ...(producto.imagenes?.map((i) => i.imagen) || []),
      ].filter((url) => typeof url === "string" && url.trim() !== "");
    }

    // 🔥 eliminar duplicados
    imgs = [...new Set(imgs)];

    console.log("IMAGENES FINALES:", imgs); // DEBUG

    setImagenes(imgs);

    // 🔥 reset slider
    setTimeout(() => {
      sliderRef.current?.slickGoTo(0);
    }, 0);

  }, [varianteSeleccionada, producto]);

  const precioActual =
    varianteSeleccionada?.precio ?? producto.precio;

  const stockTotal = producto.variantes?.reduce(
    (acc, v) => acc + (v.stock || 0),
    0
  ) || 0;

  const handleAdd = async () => {
    if (!isAuthenticated) {
      toast.info("Inicia sesión");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (tieneVariantes && !varianteSeleccionada) {
      toast.warning("Selecciona variante");
      return;
    }

    try {
      await agregarAlCarrito(
        producto.id,
        varianteSeleccionada?.id || null,
        1
      );
      toast.success("Agregado ✅");
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
    infinite: imagenes.length > 1,
    speed: 400,
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

      <Grid container spacing={5} justifyContent="center" alignItems="center">

        {/* IMÁGENES */}
        <Grid item xs={12} md={6}>
          <Box sx={imagenContainerSx(theme)}>
            {imagenes.length > 0 ? (
              <Slider ref={sliderRef} {...settings}>
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
            ) : (
              <Typography>No hay imágenes disponibles</Typography>
            )}
          </Box>
        </Grid>

        {/* DETALLE */}
        <Grid item xs={12} md={6}>
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
              startIcon={<AddShoppingCartIcon />}
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
              Agregar al carrito
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* ZOOM */}
      <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)}>
        <Box sx={{ position: "relative", bgcolor: "#000" }}>
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{ position: "absolute", top: 10, right: 10, color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src={zoomImage}
            sx={{
              maxHeight: "80vh",
              maxWidth: "100%",
              display: "block",
              margin: "auto",
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
