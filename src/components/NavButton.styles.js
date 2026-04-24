const navButtonStyles = (theme, isActive, item, alwaysColoredPaths) => ({
  fontSize: "1.05rem",
  fontWeight: 600,
  color: "#fff",
  borderRadius: "14px",
  textTransform: "none",
  width: "100%",
  py: 1.2,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",

  "& .MuiButton-startIcon": {
    color: "#fff",
    transition: "transform 0.3s ease",
  },

  // 🎨 Fondo base
  background: {
    xs: item.color,
    md:
      isActive || alwaysColoredPaths.includes(item.path)
        ? `linear-gradient(135deg, ${item.color}, ${item.color}cc)`
        : "transparent",
  },

  // ✨ Estado activo
  boxShadow: isActive
    ? `0 8px 25px ${item.color}55`
    : "none",

  transform: isActive ? "translateY(-2px) scale(1.03)" : "scale(1)",

  // 🔥 Hover premium
  "&:hover": {
    background: {
      xs: item.color,
      md: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
    },
    boxShadow: `0 10px 30px ${item.color}66`,
    transform: "translateY(-3px) scale(1.04)",
    filter: "brightness(1.08)",

    "& .MuiButton-startIcon": {
      transform: "translateX(4px)", // pequeño movimiento cool
    },
  },

  // 🌊 Efecto shimmer (detalle PRO)
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent)",
    transition: "all 0.6s ease",
  },

  "&:hover::before": {
    left: "100%",
  },

  // 🌙 Dark mode ajuste fino
  ...(theme.palette.mode === "dark" && {
    "&:hover": {
      filter: "brightness(1.15)",
    },
  }),
});

export default navButtonStyles;
