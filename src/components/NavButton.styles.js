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

  // Fondo dinámico
  background: {
    xs: item.color, // móvil siempre con color
    md:
      isActive || alwaysColoredPaths.includes(item.path)
        ? item.color
        : "transparent",
  },

  // Estado activo
  boxShadow: isActive ? "0 0 20px rgba(255,255,255,0.5)" : "none",
  transform: isActive ? "translateY(-1px)" : "translateY(0)",

  // 🔥 HOVER (sin romper layout)
  "&:hover": {
    background: {
      xs: item.color,
      md: item.color, // mismo color, no se deforma
    },
    transform: "translateY(-2px)", // 👈 sin scale
    boxShadow: isActive
      ? "0 6px 20px rgba(0,0,0,0.35)"
      : "0 4px 14px rgba(0,0,0,0.25)",
  },

  // 🌙 DARK MODE
  ...(theme.palette.mode === "dark" && {
    color: "#fff",
    "&:hover": {
      background: {
        xs: item.color,
        md: item.color,
      },
      boxShadow: "0 6px 22px rgba(0,0,0,0.6)",
      transform: "translateY(-2px)",
    },
  }),
});

export default navButtonStyles;
