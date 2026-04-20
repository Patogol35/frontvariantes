import { useEffect, useState, useMemo } from "react";
import { getProductos } from "../api/api";

export function useProductos({ categoria, search, sort, itemsPerPage }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔹 Debounce búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 Fetch productos
  useEffect(() => {
    setLoading(true);

    getProductos(categoria ? { categoria } : {})
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setProductos(lista);
        setPage(1);
      })
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, [categoria]);

  // 🔹 Filtrar y ordenar (memorizado)
  const filtered = useMemo(() => {
  const getPrecio = (producto) => {
    if (!producto.variantes?.length) {
      return producto.precio || 0;
    }

    const precios = producto.variantes
      .map((v) => v.precio)
      .filter(Boolean);

    return precios.length
      ? Math.min(...precios)
      : producto.precio || 0;
  };

  return (productos || [])
    .filter((p) =>
      debouncedSearch === ""
        ? true
        : p.nombre?.toLowerCase().includes(debouncedSearch)
    )
    .sort((a, b) =>
      sort === "asc"
        ? getPrecio(a) - getPrecio(b)
        : getPrecio(b) - getPrecio(a)
    );
}, [productos, debouncedSearch, sort]);

  // 🔹 Paginación (único lugar donde se calcula)
  const paginated = useMemo(() => {
    return filtered.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [filtered, page, itemsPerPage]);

  return { loading, filtered, paginated, page, setPage };
}
