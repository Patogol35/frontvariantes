const detalleModalStyles = {
  dialog: {
    zIndex: 1600,
    "& .MuiBackdrop-root": {
      backgroundColor: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(5px)",
    },
  },

  dialogPaper: (theme) => ({
  borderRadius: { xs: 0, md: 3 },
  p: { xs: 2, md: 4 },

  bgcolor: theme.palette.mode === "dark" ? "#121212" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",

  width: "100%",
  maxWidth: { xs: "95%", md: 700 },

  maxHeight: "90vh",
  overflowY: "auto",

  position: "relative",
  textAlign: "center",

  "@media (orientation: landscape)": {
    maxHeight: "75vh",
    marginTop: "5vh",
    marginBottom: "5vh",
  },
}),

  botonCerrar: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    bgcolor: "rgba(0,0,0,0.6)",
    color: "white",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.2)",
    },
  },

  sliderBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    height: {
      xs: 250,
      md: 350,
    },

    cursor: "zoom-in",
  },

  imagen: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: 2,
    border: "2px solid rgba(255,255,255,0.2)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },

  stockChip: {
    color: "white",
    borderColor: "white",
    fontWeight: "bold",
  },

  descripcion: {
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.85)",
  },
};

export default detalleModalStyles;
