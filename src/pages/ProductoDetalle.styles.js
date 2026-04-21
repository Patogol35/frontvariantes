// ================================
// CONTENEDOR PRINCIPAL
// ================================
export const containerSx = {
  maxWidth: 1100,
  mx: "auto",
  p: { xs: 2, md: 5 },

  display: "flex",
  flexDirection: "column",
  alignItems: "center",     // 🔥 centra horizontal
  textAlign: "center",      // 🔥 centra textos
  gap: 4,
};


// ================================
// BOTÓN VOLVER
// ================================
export const botonVolverSx = (theme) => ({
  alignSelf: "center",      // 🔥 centrado

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
  p: 3,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  border: "1px solid",
  borderColor: theme.palette.divider,

  boxShadow:
    theme.palette.mode === "dark"
      ? "0 20px 50px rgba(0,0,0,0.7)"
      : "0 20px 50px rgba(0,0,0,0.08)",

  overflow: "hidden",

  transition: "all 0.3s ease",

  "&:hover img": {
    transform: "scale(1.08)",
  },
});


// ================================
// IMAGEN SLIDE
// ================================
export const imagenSlideSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: { xs: 300, md: 500 },
  cursor: "pointer",
};


// ================================
// IMAGEN
// ================================
export const imagenSx = {
  maxWidth: "90%",     // 🔥 más pequeña
  maxHeight: 420,      // 🔥 reduce altura
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
  textAlign: "center",
};


// ================================
// PRECIO
// ================================
export const precioSx = (theme) => ({
  fontWeight: 800,
  fontSize: "2rem",
  textAlign: "center",

  color:
    theme.palette.mode === "dark"
      ? "#66b2ff"
      : "#0d47a1",
});


// ================================
// STOCK
// ================================
export const stockSx = (stock) => ({
  alignSelf: "center",   // 🔥 centrado total

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
  justifyContent: "center",   // 🔥 centra horizontal
  flexWrap: "wrap",
  gap: 1,
};

export const varianteBtnSx = (isSelected, stock, theme) => ({
  borderRadius: "999px",
  textTransform: "none",
  fontWeight: 500,

  px: 2,
  py: 0.7,

  border: "2px solid",   // 🔥 más grueso

  borderColor: isSelected
    ? theme.palette.primary.main
    : theme.palette.grey[400],   // 🔥 más visible

  backgroundColor: isSelected
    ? theme.palette.primary.main
    : theme.palette.background.paper,

  color: isSelected ? "#fff" : theme.palette.text.primary,

  opacity: stock === 0 ? 0.4 : 1,

  transition: "all 0.25s ease",

  "&:hover": {
    borderColor:
      stock > 0 ? theme.palette.primary.main : undefined,
    transform: stock > 0 ? "scale(1.05)" : "none",
  },
});

// ================================
// DESCRIPCIÓN
// ================================
export const descripcionSx = {
  color: "text.secondary",
  lineHeight: 1.7,
  fontSize: "0.95rem",
  textAlign: "center",
};


// ================================
// BOTÓN AGREGAR
// ================================
export const botonAgregarSx = (stock) => ({
  alignSelf: "center",   // 🔥 centrado total

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
