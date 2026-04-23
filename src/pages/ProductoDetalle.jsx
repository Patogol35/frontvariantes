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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";

import {
  containerSx,
  botonVolverSx,
  imagenContainerSx,
  imagenSx,
  tituloSx,
  precioSx,
  varianteBtnSx,
  descripcionSx,
  botonAgregarSx,
  stockSx,
  variantesContainerSx,
  imagenWrapperSx,
  miniaturasContainerSx,
  miniaturaSx,
  zoomContainerSx,
  zoomCloseBtnSx,
  zoomImagenSx,
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

  if (!producto) return <Typography>Producto no encontrado</Typography>;

  const tieneVariantes = producto.variantes?.length > 0;

  const getImagen = (img) => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object" && img.imagen) return img.imagen;
    return null;
  };

  const imagenes = useMemo(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      return varianteSeleccionada.imagenes
        .map(getImagen)
        .filter(Boolean);
    }

    return [
      producto.imagen,
      ...(producto.imagenes || []),
    ]
      .map(getImagen)
      .filter(Boolean);
  }, [producto, varianteSeleccionada]);

  // CONTROL  DE MINIATURAS
  const mostrarMiniaturas = useMemo(() => {
    if (varianteSeleccionada) {
      return varianteSeleccionada.imagenes?.length > 1;
    }

    const totalProductoImgs =
      [producto.imagen, ...(producto.imagenes || [])]
        .map(getImagen)
        .filter(Boolean).length;

    return totalProductoImgs > 1;
  }, [producto, varianteSeleccionada]);

  const [imagenMostrada, setImagenMostrada] = useState(
    imagenes[0] || ""
  );

  useEffect(() => {
    if (imagenes.length > 0) {
      setImagenMostrada(imagenes[0]);
    }
  }, [imagenes]);

  const cambiarImagen = (imgUrl) => {
    const img = new Image();
    img.src = imgUrl;

    img.onload = () => {
      setImagenMostrada(imgUrl);
    };
  };

  const precioActual =
    varianteSeleccionada?.precio ?? producto.precio;

  const stockTotal = producto.variantes?.length
    ? producto.variantes.reduce((acc, v) => acc + (v.stock || 0), 0)
    : producto.stock || 1;

  const handleAdd = async () => {
    if (!isAuthenticated) {
      toast.info("Inicia sesión para continuar");
      navigate("/login", { state: { from: location } });
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

      toast.success(`${producto.nombre} agregado al carrito 🛒`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Box sx={containerSx}>
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
          <Box sx={imagenWrapperSx}>

  {/* IMAGEN PRINCIPAL */}
  <Box
    sx={{
      ...imagenContainerSx(theme),
      cursor: "zoom-in",
    }}
    onClick={() => {
      setZoomImage(imagenMostrada);
      setZoomOpen(true);
    }}
  >
    <Box
      component="img"
      src={imagenMostrada}
      sx={imagenSx}
    />
  </Box>

  {/* MINIATURAS ABAJO */}
  {mostrarMiniaturas && (
    <Box sx={miniaturasContainerSx}>
      {imagenes.map((img, i) => (
        <Box
          key={i}
          component="img"
          src={img}
          onClick={() => cambiarImagen(img)}
          sx={miniaturaSx(imagenMostrada === img)}
        />
      ))}
    </Box>
  )}

</Box>
            )}

            <Box
              sx={{
                ...imagenContainerSx(theme),
                cursor: "zoom-in",
              }}
              onClick={() => {
                setZoomImage(imagenMostrada);
                setZoomOpen(true);
              }}
            >
              <Box
                component="img"
                src={imagenMostrada}
                sx={imagenSx}
              />
            </Box>

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
      <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)}>
        <Box sx={zoomContainerSx(theme)}>
          <IconButton onClick={() => setZoomOpen(false)} sx={zoomCloseBtnSx}>
            <CloseIcon />
          </IconButton>

          <Box component="img" src={zoomImage} sx={zoomImagenSx} />
        </Box>
      </Dialog>
    </Box>
  );
              }
