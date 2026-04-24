import {
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  ListAlt as ListAltIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import { menuColors } from "../theme/colors"; // 👈 IMPORTANTE

export const authMenu = [
  {
    label: "Inicio",
    path: "/",
    icon: HomeIcon,
    color: menuColors.primary,
  },
  {
    label: "Carrito",
    path: "/carrito",
    icon: ShoppingCartIcon,
    color: menuColors.success,
  },
  {
    label: "Mis pedidos",
    path: "/pedidos",
    icon: ListAltIcon,
    color: menuColors.warning,
  },
];

export const guestMenu = [
  {
    label: "Iniciar sesión",
    path: "/login",
    icon: LoginIcon,
    color: menuColors.primary,
  },
  {
    label: "Registrarse",
    path: "/register",
    icon: PersonAddIcon,
    color: menuColors.secondary,
  },
];
