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
  transform: isActive ? "scale(1.04)" : "scale(1)",

  // 🔥 HOVER FIX 
"&:hover": {
  background: {
    xs: item.color,
    md: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`,
  },
  boxShadow: isActive
    ? "0 6px 22px rgba(0,0,0,0.35)"
    : "0 4px 16px rgba(0,0,0,0.25)",
  transform: "translateY(-2px) scale(1.02)", // 👈 bajé un poco el scale
  filter: "saturate(1.08)", // 👈 más sutil
},

// 🌙 DARK MODE
...(theme.palette.mode === "dark" && {
  "&:hover": {
    background: {
      xs: item.color,
      md: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
    },
    boxShadow: "0 8px 26px rgba(0,0,0,0.6)",
    transform: "translateY(-2px) scale(1.02)",
    filter: "saturate(1.12)",
  },
}),

export default navButtonStyles;
