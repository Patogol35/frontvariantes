const registerStyles = {
  container: (theme) => ({
    minHeight: "75vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 2,
  }),

  paper: (theme) => ({
    p: 4,
    borderRadius: 3,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 3,

    // BORDE 
    border: "1px solid",
borderColor:
  theme.palette.mode === "dark"
    ? "#fff"   
    : "#000",  

    // SOMBRA
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 24px rgba(0,0,0,0.5)"
        : "0 12px 24px rgba(0,0,0,0.15)",

    //  FONDO
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#1e1e1e"
        : "rgba(255,255,255,0.95)",

    color: theme.palette.mode === "dark" ? "#fff" : "#000",

    backdropFilter: "blur(8px)",
  }),

  titulo: (theme) => ({
    color: theme.palette.mode === "dark" ? "#42a5f5" : "#1976d2",
  }),

  subtitulo: (theme) => ({
  mb: 2,
  color:
    theme.palette.mode === "dark"
      ? "#f5f5f5" 
      : "#666",   
}),

  strengthBox: {
    my: 1,
  },

  strengthBar: (theme, color) => ({
    height: 8,
    borderRadius: 4,
    mb: 0.5,
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#ddd",
    "& .MuiLinearProgress-bar": { backgroundColor: color },
  }),

  strengthLabel: (color) => ({
    color,
    fontWeight: "bold",
  }),

  checkbox: {
    mt: 1,
  },

  // BOTÓN LOGIN
  botonRegister: (theme) => ({
    py: 1.4,
    fontWeight: 600,
    borderRadius: 2,

    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #42a5f5, #1e88e5)"
        : "linear-gradient(135deg, #1976d2, #42a5f5)",

    color: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",

    transition: "all 0.25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
    },
  }),

  // BOTÓN SECUNDARIO 
  botonLogin: (theme) => ({
    py: 1.3,
    fontWeight: 500,
    borderRadius: 2,

    border: "1px solid",
    borderColor:
      theme.palette.mode === "dark" ? "#42a5f5" : "#1976d2",

    color:
      theme.palette.mode === "dark" ? "#42a5f5" : "#1976d2",

    backgroundColor: "transparent",

    transition: "all 0.25s ease",

    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(66,165,245,0.08)"
          : "rgba(25,118,210,0.08)",
      transform: "translateY(-2px)",
    },
  }),

  // 
  acciones: {
    display: "flex",
    flexDirection: "column",
    gap: 1.2,
    mt: 1,
  },
};

export default registerStyles;
