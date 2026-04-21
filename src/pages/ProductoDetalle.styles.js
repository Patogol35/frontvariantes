import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";


// ================================
// CONTENEDOR PRINCIPAL
// ================================
export const containerSx = {
  maxWidth: 1200,
  mx: "auto",
  p: { xs: 2, md: 5 },

  display: "flex",
  flexDirection: "column",
  gap: 3,
};


// ================================
// BOTÓN VOLVER
// ================================
export const botonVolverSx = (theme) => ({
  mb: 2,
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 500,
  px: 2,

  border: "1px solid",
  borderColor: theme.palette.divider,

  color: theme.palette.text.primary,

  transition: "all 0.25s ease",

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateX(-3px)",
  },
});


// ================================
// CONTENEDOR IMÁGENES
// ================================
export const imagenContainerSx = (theme) => ({
  bgcolor: theme.palette.background.paper,
  borderRadius: 4,
  p: 2,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  border: "1px solid",
  borderColor: theme.palette.divider,

  boxShadow:
    theme.palette.mode === "dark"
      ? "0 10px 30px rgba(0,0,0,0.6)"
      : "0 10px 30px rgba(0,0,0,0.08)",

  transition: "all 0.3s ease",

  "&:hover": {
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 15px 40px rgba(0,0,0,0.8)"
        : "0 15px 40px rgba(0,0,0,0.12)",
  },
});


// ================================
// IMAGEN SLIDER
// ================================
export const imagenSlideSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: { xs: 300, md: 500 },
};


// ================================
// IMAGEN (centrada real)
// ================================
export const imagenSx = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  borderRadius: 3,

  display: "block",
  margin: "0 auto",

  transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",

  "&:hover": {
    transform: "scale(1.08)",
  },
};


// ================================
// TÍTULO
// ================================
export const tituloSx = {
  fontWeight: 700,
  fontSize: { xs: "1.4rem", md: "1.8rem" },
};


// ================================
// PRECIO
// ================================
export const precioSx = (theme) => ({
  fontWeight: 800,
  fontSize: "1.8rem",

  color:
    theme.palette.mode === "dark"
      ? "#66b2ff"
      : "#0d47a1",

  letterSpacing: 0.5,
});


// ================================
// CHIP STOCK (MEJORADO 🔥)
// ================================
export const stockChipSx = (stock) => ({
  width: "fit-content",
  borderRadius: 999,
  px: 1.5,
  py: 0.3,
  fontSize: "0.75rem",
  fontWeight: 600,

  backgroundColor: stock > 0 ? "#e8f5e9" : "#ffebee",
  color: stock > 0 ? "#2e7d32" : "#c62828",
});


// ================================
// VARIANTES BOTÓN
// ================================
export const varianteBtnSx = (isSelected, stock, theme) => ({
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 500,
  px: 2.5,
  py: 1,

  border: "1px solid",
  borderColor: isSelected
    ? theme.palette.primary.main
    : theme.palette.divider,

  backgroundColor: isSelected
    ? theme.palette.primary.main
    : "transparent",

  color: isSelected
    ? "#fff"
    : theme.palette.text.primary,

  opacity: stock === 0 ? 0.3 : 1,

  boxShadow: isSelected
    ? "0 4px 12px rgba(0,0,0,0.2)"
    : "none",

  transition: "all 0.25s ease",

  "&:hover": {
    transform: stock > 0 ? "scale(1.07)" : "none",
    borderColor: theme.palette.primary.main,
  },
});


// ================================
// DESCRIPCIÓN
// ================================
export const descripcionSx = {
  color: "text.secondary",
  lineHeight: 1.8,
  fontSize: "0.95rem",
};


// ================================
// BOTÓN AGREGAR (FULL WIDTH + ICON 🔥)
// ================================
export const botonAgregarSx = (stock) => ({
  width: "100%", // 🔥 ocupa todo el ancho
  borderRadius: 999,
  py: 1.6,
  fontWeight: 700,
  fontSize: "1rem",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 1,

  background:
    stock > 0
      ? "linear-gradient(135deg, #1976d2, #42a5f5)"
      : "#9e9e9e",

  color: "#fff",

  boxShadow:
    stock > 0
      ? "0 6px 18px rgba(25, 118, 210, 0.4)"
      : "none",

  transition: "all 0.3s ease",

  "&:hover": {
    transform: stock > 0 ? "scale(1.03)" : "none",
    boxShadow:
      stock > 0
        ? "0 10px 25px rgba(25, 118, 210, 0.6)"
        : "none",
  },
});


// ================================
// ICONO (usar en el botón)
// ================================
export const carritoIcon = ShoppingCartCheckoutIcon;
