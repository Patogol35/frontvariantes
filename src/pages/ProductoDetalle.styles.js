// ================================
// CONTENEDOR PRINCIPAL
// ================================
export const containerSx = {
  maxWidth: 1100,
  mx: "auto",
  p: { xs: 2, md: 5 },

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 4,
};


// ================================
// BOTÓN VOLVER
// ================================
export const botonVolverSx = (theme) => ({
  alignSelf: "center",

  borderRadius: "999px",
  textTransform: "none",
  fontWeight: 500,

  px: 2,
  py: 0.6,

  border: "1px solid",
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,

  backdropFilter: "blur(6px)",

  transition: "all 0.25s ease",

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.05)",
  },
});


// ================================
// IMAGEN CONTENEDOR
// ================================
export const imagenContainerSx = (theme) => ({
  bgcolor: theme.palette.background.paper,
  borderRadius: 5,
  p: 2,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  maxHeight: 320,
  maxWidth: 240,
  border: "1px solid",
  borderColor:
    theme.palette.mode === "dark"
      ? "#fff"
      : "#000",

  boxShadow:
    theme.palette.mode === "dark"
      ? "0 20px 50px rgba(0,0,0,0.7)"
      : "0 20px 50px rgba(0,0,0,0.08)",

  overflow: "hidden",

  transition: "all 0.3s ease",

  "&:hover": {
    transform: "scale(1.01)",
  },

  "&:hover img": {
    transform: "scale(1.08)",
   },
});


// ================================
// IMAGEN SLIDE
// ================================
export const imagenSlideSx = {
//  display: "flex",
 // justifyContent: "center",
//  alignItems: "center",
//  height: { xs: 300, md: 500 },
//  cursor: "pointer",
};


// ================================
// IMAGEN
// ================================
export const imagenSx = {
  maxWidth: "80%",
  maxHeight: 440,
  objectFit: "contain",
  borderRadius: 3,
  transition: "transform 0.5s ease",
};


// ================================
// TÍTULO
// ================================
export const tituloSx = {
  fontWeight: 700,
  fontSize: { xs: "1.5rem", md: "2rem" },
};


// ================================
// PRECIO
// ================================
export const precioSx = (theme) => ({
  fontWeight: 800,
  fontSize: "2rem",

  color:
    theme.palette.mode === "dark"
      ? "#66b2ff"
      : "#0d47a1",
});


// ================================
// STOCK
// ================================
export const stockSx = (stock) => ({
  alignSelf: "center",

  px: 1.8,
  py: 0.5,

  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: 600,

  backdropFilter: "blur(6px)",

  background:
    stock > 0
      ? "linear-gradient(135deg, #e8f5e9, #c8e6c9)"
      : "linear-gradient(135deg, #ffebee, #ffcdd2)",

  color: stock > 0 ? "#1b5e20" : "#b71c1c",

  border: "1px solid",
  borderColor: stock > 0 ? "#a5d6a7" : "#ef9a9a",
});


// ================================
// VARIANTES
// ================================
export const variantesContainerSx = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 1,
};

export const varianteBtnSx = (isSelected, stock, theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    borderRadius: "999px",
    textTransform: "none",
    fontWeight: 500,

    px: 2,
    py: 0.7,

    // 🔥 BORDE SIEMPRE PRESENTE
    border: "1px solid",
    borderColor: isDark ? "#fff" : "#000",

    // 🔥 FONDO
    backgroundColor: isSelected
  ? "#000"
  : "#e3f2fd",

    // 🔥 TEXTO
    color: isSelected
  ? "#fff"
  : isDark
  ? "#000"
  : theme.palette.text.primary,

    opacity: stock === 0 ? 0.4 : 1,

    transition: "all 0.25s ease",

    "&:hover": {
      transform: stock > 0 ? "scale(1.05)" : "none",

      // 🔥 HOVER MÁS INTENSO
      backgroundColor: isSelected
        ? "#000"
        : isDark
        ? "rgba(144,202,249,0.4)"
        : "#bbdefb",
    },
  };
};

// ================================
// DESCRIPCIÓN
// ================================
export const descripcionSx = {
  color: "text.secondary",
  lineHeight: 1.7,
  fontSize: "0.95rem",
};


// ================================
// BOTÓN AGREGAR
// ================================
export const botonAgregarSx = (stock) => ({
  alignSelf: "center",

  borderRadius: "999px",
  px: 3,
  py: 1.2,

  display: "flex",
  alignItems: "center",
  gap: 1,

  fontWeight: 700,

  background:
    stock > 0
      ? "linear-gradient(135deg, #1976d2, #42a5f5)"
      : "#9e9e9e",

  color: "#fff",

  boxShadow:
    stock > 0
      ? "0 10px 25px rgba(25,118,210,0.4)"
      : "none",

  transition: "all 0.25s ease",

  "&:hover": {
    transform: stock > 0 ? "scale(1.05)" : "none",
  },
});
