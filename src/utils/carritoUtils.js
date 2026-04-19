export const calcularSubtotal = (item) => {
  const precio =
    item.variante?.precio ??
    item.producto?.precio ??
    0;

  return precio * item.cantidad;
};
