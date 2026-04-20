import { useEffect, useState } from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { getPedidos } from "../api/api";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Box,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import pedidosStyles from "./Pedidos.styles";

const PAGE_SIZE = 10;

export default function Pedidos() {
  const { access } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setLoading(true);

    getPedidos(access, page)
      .then((data) => {
        if (!data?.results) return;

        setTotalCount(data.count);

        const ordenados = [...data.results].sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );

        const pedidosNumerados = ordenados.map((p, index) => ({
          ...p,
          numeroLocal: data.count - ((page - 1) * PAGE_SIZE + index),
        }));

        setPedidos(pedidosNumerados);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [access, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Entregado":
        return "success";
      case "En preparación":
        return "warning";
      case "Enviado":
        return "info";
      default:
        return "default";
    }
  };

  if (loading && pedidos.length === 0)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Cargando pedidos...</Typography>
      </Container>
    );

  if (totalCount === 0)
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Aún no tienes pedidos</Typography>
        <Typography variant="body2" color="text.secondary">
          Cuando compres algo aparecerá aquí
        </Typography>
      </Container>
    );

  return (
    <Container sx={pedidosStyles.container}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        align="center"
        sx={pedidosStyles.titulo}
      >
        <ListAltIcon color="primary" sx={pedidosStyles.icono} />
        Mis Pedidos
      </Typography>

      {pedidos.map((p) => (
        <Card key={p.id} sx={pedidosStyles.card}>
          <CardContent>

            {/* HEADER */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
              }}
            >
              <Typography fontWeight="bold">
                Pedido #{p.numeroLocal}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {new Date(p.fecha).toLocaleString()}
              </Typography>

              <Chip
                label={`Total: $${Number(p.total).toFixed(2)}`}
                color="primary"
              />
            </Box>

            {/* ITEMS */}
            <List dense>
              {(p.items ?? []).map((item, i, arr) => {
                
                // 🧠 VARIANTE DINÁMICA (igual que carrito/modal)
                const varianteLabel = item.variante
                  ? [
                      item.variante.talla,
                      item.variante.color,
                      item.variante.modelo,
                      item.variante.capacidad,
                    ]
                      .filter(Boolean)
                      .map((x) => x.trim())
                      .filter((v, i, arr) => arr.indexOf(v) === i)
                      .join(" • ")
                  : null;

                // 🖼 IMAGEN CON FALLBACK
                const imagen =
                  item.variante?.imagenes?.[0]?.imagen ||
                  item.producto?.imagenes?.[0]?.imagen ||
                  item.producto?.imagen ||
                  "/placeholder.png";

                return (
                  <Box key={i}>
                    <ListItem sx={pedidosStyles.listItem}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        {/* IMAGEN */}
                        <Box
                          component="img"
                          src={imagen}
                          alt={item.producto?.nombre}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 2,
                          }}
                        />

                        {/* INFO */}
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight="bold">
                            {item.producto?.nombre}
                          </Typography>

                          {/* 🔥 VARIANTE COMPLETA */}
                          {varianteLabel && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {varianteLabel}
                            </Typography>
                          )}

                          <Typography variant="body2">
                            {item.cantidad} x $
                            {Number(item.precio_unitario ?? 0).toFixed(2)}
                          </Typography>

                          <Typography
                            variant="body2"
                            fontWeight="bold"
                          >
                            Subtotal: $
                            {Number(item.subtotal ?? 0).toFixed(2)}
                          </Typography>
                        </Box>

                        {/* ESTADO */}
                        {item.estado && (
                          <Chip
                            label={item.estado}
                            color={getEstadoColor(item.estado)}
                            size="small"
                          />
                        )}
                      </Box>
                    </ListItem>

                    {i < arr.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </List>
          </CardContent>
        </Card>
      ))}

      {/* PAGINACIÓN */}
      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </Button>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Página {page} de {totalPages}
        </Typography>

        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </Button>
      </Stack>
    </Container>
  );
}
