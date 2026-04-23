const pedidosStyles = {
  container: {
    mt: 4,
    mb: 6,
  },

  titulo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
    color: "primary.main",
    mb: 4,
  },

  icono: {
    fontSize: 36,
  },

  card: {
    mb: 3,
    borderRadius: 3,
    boxShadow: 3,
    transition: "all 0.3s",
    "&:hover": { boxShadow: 6, transform: "scale(1.01)" },
  },

  header: {
    mb: 1,
  },

  listItem: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    py: 1,
  },

  chip: {
    mt: { xs: 1, sm: 0 },
  },

  emptyState: {
  mt: 8,
  textAlign: "center",
},

emptyIcon: {
  fontSize: 70,
  opacity: 0.5,
  mb: 1,
},

emptyTitle: (theme) => ({
  fontWeight: "bold",
  mb: 1,
  color: theme.palette.text.primary,
}),

emptySubtitle: (theme) => ({
  color:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.8)"
      : "#666",
  mb: 2,
}),

emptyButton: {
  mt: 1,
  borderRadius: 2,
},
};

export default styles; 
