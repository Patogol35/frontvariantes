const navButtonStyles = (theme, isActive, item, alwaysColoredPaths) => ({
  fontSize: "1.05rem",
  fontWeight: 600,
  color: "#fff",
  borderRadius: "12px",
  textTransform: "none",
  width: "100%",
  py: 1.2,

  transition: "all 0.25s ease",
  "& .MuiButton-startIcon": { color: "#fff" },

  // 🔥 IMPORTANTE: centra visualmente
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,

  // Fondo dinámico
  background: {
    xs: item.color,
    md:
      isActive || alwaysColoredPaths.includes(item.path)
        ? item.color
        : "transparent",
  },

  // Estado activo (SIN scale agresivo)
  boxShadow: isActive ? "0 0 20px rgba(255,255,255,0.5)" : "none",
  transform: isActive ? "scale(1.02)" : "scale(1)", // 👈 bajado

  transformOrigin: "center", // 👈 CLAVE

  // 🔥 HOVER FIX REAL
  "&:hover": {
    background: {
      xs: item.color,
      md: `linear-gradient(135deg, ${item.color} 0%, ${item.color}e6 100%)`,
    },
    boxShadow: isActive
      ? "0 0 20px rgba(0,0,0,0.4)"
      : "0 0 12px rgba(0,0,0,0.25)",

    transform: "scale(1.02)", // 👈 pequeño, no rompe
  },

  // 🌙 DARK MODE
  ...(theme.palette.mode === "dark" && {
    color: "#fff",
    "&:hover": {
      background: {
        xs: item.color,
        md: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
      },
    },
  }),
});

export default navButtonStyles;
