import {
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  ListAlt as ListAltIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import { ROUTES } from "./routes";

export const authMenu = [
  {
    label: "Inicio",
    path: ROUTES.HOME,
    icon: HomeIcon,
    color: "primary",
  },
  {
    label: "Carrito",
    path: ROUTES.CART,
    icon: ShoppingCartIcon,
    color: "success",
  },
  {
    label: "Mis pedidos",
    path: ROUTES.ORDERS,
    icon: ListAltIcon,
    color: "warning",
  },
];

export const guestMenu = [
  {
    label: "Iniciar sesión",
    path: ROUTES.LOGIN,
    icon: LoginIcon,
    color: "primary",
  },
  {
    label: "Registrarse",
    path: ROUTES.REGISTER,
    icon: PersonAddIcon,
    color: "secondary",
  },
];
