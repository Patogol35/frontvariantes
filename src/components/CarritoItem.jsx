import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  TextField,
  IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { toast } from "react-toastify";
import { calcularSubtotal } from "../utils/carritoUtils";
import carritoItemStyles from "./CarritoItem.styles";

export default function CarritoItem({
  it,
  incrementar,
  decrementar,
  setCantidad,
  eliminarItem,
}) {
  // 🔥 STOCK (VARIANTE > PRODUCTO)
  const stock = it.variante?.stock ?? it.producto?.stock ?? 0;

  // 🖼 IMAGEN DINÁMICA (con fallback)
  const imagen =
    it.variante?.imagenes?.[0]?.imagen ||
    it.producto?.imagenes?.[0]?.imagen ||
    it.producto?.imagen ||
    "/placeholder.png";

  // 🧠 LABEL DINÁMICO DE VARIANTE (igual que modal)
  const varianteLabel = it.variante
    ? [
        it.variante.talla,
        it.variante.color,
        it.variante.modelo,
        it.variante.capacidad,
      ]
        .filter(Boolean)
        .map((x) => x.trim())
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .join(" • ")
    : null;

  return (
    <Card sx={carritoItemStyles.card}>
      {/* Imagen producto */}
      <CardMedia
        component="img"
        image={imagen}
        alt={it.producto?.nombre}
        sx={(theme) => carritoItemStyles.media(theme)}
      />

      {/* Info producto */}
      <CardContent sx={carritoItemStyles.content}>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {it.producto?.nombre}
          </Typography>

          {/* 🔥 VARIANTE */}
          {varianteLabel && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {varianteLabel}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={carritoItemStyles.descripcion}
          >
            {it.producto?.descripcion}
          </Typography>
        </Box>

        {/* 💰 Precio + 📦 Stock */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            icon={<MonetizationOnIcon />}
            label={`$${calcularSubtotal(it).toFixed(2)}`}
            color="success"
            sx={carritoItemStyles.chipSubtotal}
          />

          <Chip
            label={
              stock > 0
                ? `Stock: ${stock} unidades`
                : "Agotado"
            }
            color={stock > 0 ? "info" : "default"}
            sx={carritoItemStyles.chipStock}
          />
        </Box>
      </CardContent>

      {/* 🎛 CONTROLES */}
      <Box sx={carritoItemStyles.controlesWrapper}>
        <Box sx={carritoItemStyles.cantidadWrapper}>
          {/* ➖ Restar */}
          <IconButton
            onClick={() => decrementar(it)}
            disabled={it.cantidad <= 1 || stock === 0}
            sx={carritoItemStyles.botonCantidad}
          >
            <RemoveIcon />
          </IconButton>

          {/* 🔢 Input */}
          <TextField
            type="number"
            size="small"
            value={it.cantidad}
            inputProps={{ min: 1, max: stock }}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                setCantidad(it.id, 1);
                return;
              }

              const nuevaCantidad = Number(value);

              if (nuevaCantidad >= 1 && nuevaCantidad <= stock) {
                setCantidad(it.id, nuevaCantidad);
              } else if (nuevaCantidad > stock) {
                toast.warning(`Solo hay ${stock} unidades`);
                setCantidad(it.id, stock);
              } else {
                setCantidad(it.id, 1);
              }
            }}
            sx={carritoItemStyles.cantidadInput}
          />

          {/* ➕ Sumar */}
          <IconButton
            onClick={() => incrementar(it)}
            disabled={it.cantidad >= stock || stock === 0}
            sx={carritoItemStyles.botonCantidad}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* 🗑 Eliminar */}
        <IconButton
          onClick={() => {
            eliminarItem(it.id);
            toast.info("🗑 Producto eliminado");
          }}
          sx={carritoItemStyles.botonEliminar}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
