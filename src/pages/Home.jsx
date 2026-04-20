import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Pagination,
  CircularProgress,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import SortIcon from "@mui/icons-material/Sort";
import CategoryIcon from "@mui/icons-material/Category";

import ProductoCard from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
import { useCarritoHandler } from "../hooks/useCarritoHandler";
import DetalleModal from "../components/DetalleModal";
import LightboxModal from "../components/LightboxModal";

import styles from "./Home.styles";

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const [categoria, setCategoria] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");

  // 🔥 NUEVOS ESTADOS
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoModal, setModoModal] = useState("info"); // 👈 CLAVE
  const [lightbox, setLightbox] = useState(null);

  const categorias = useCategorias();

  const { loading, filtered, paginated, page, setPage } = useProductos({
    categoria,
    search,
    sort,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const { handleAdd } = useCarritoHandler();

  // 🔥 FUNCIÓN CLAVE
  const handleVerDetalle = (producto, modo = "info") => {
    setProductoSeleccionado(producto);
    setModoModal(modo);
  };

  const handleCerrarDetalle = () => {
    setProductoSeleccionado(null);
  };

  if (loading) {
    return (
      <Box sx={styles.loadingBox}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* ENCABEZADO */}
      <Box sx={styles.header}>
        <Typography variant="h4" sx={styles.headerTitle}>
          <HomeIcon sx={{ fontSize: 32, mr: 1 }} />
          Inicio
        </Typography>
      </Box>

      {/* FILTROS */}
      <Paper elevation={4} sx={styles.filtersContainer}>
        <TextField
          label="Buscar producto"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={styles.searchField}
        />

        <TextField
          select
          label="Categoría"
          size="small"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={styles.categoryField}
        >
          <MenuItem value="">Todas</MenuItem>
          {categorias.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Ordenar por"
          size="small"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SortIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={styles.sortField}
        >
          <MenuItem value="asc">Precio: menor a mayor</MenuItem>
          <MenuItem value="desc">Precio: mayor a menor</MenuItem>
        </TextField>
      </Paper>

      {/* PRODUCTOS */}
      <Grid container spacing={3} justifyContent="center">
        {paginated.map((prod) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ProductoCard
                producto={prod}
                onAgregar={handleAdd}
                onVerDetalle={handleVerDetalle} // 🔥 CLAVE
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* PAGINACIÓN */}
      <Box sx={styles.paginationBox}>
        <Pagination
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* 🔥 MODAL CON MODO */}
      <DetalleModal
        producto={productoSeleccionado}
        open={Boolean(productoSeleccionado)}
        onClose={handleCerrarDetalle}
        modo={modoModal} // 🔥 AQUÍ ESTÁ LA MAGIA
        setLightbox={setLightbox}
      />

      {/* LIGHTBOX */}
      <LightboxModal
        open={!!lightbox}
        onClose={() => setLightbox(null)}
        src={lightbox}
      />
    </>
  );
}
