import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "../context/ThemeContext";
import { useScrollTrigger } from "../hooks/useScrollTrigger";
import { toast } from "react-toastify";
import { authMenu, guestMenu } from "../config/menuConfig";
import NavButton from "./NavButton";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingBag as ShoppingBagIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.styles";

const MotionAppBar = motion(AppBar);

export default function Navbar() {
  const { isAuthenticated, logout, user, loading } = useAuth(); // 🔥 añadimos loading
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const scrolled = useScrollTrigger(50);

  // 🔥 evita flicker completamente
  if (loading) return null;

  const menu = isAuthenticated ? authMenu : guestMenu;

  const handleToggleMenu = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        window.dispatchEvent(new Event("menuOpen"));
      }
      return next;
    });
  }, []);

  const handleCloseMenu = useCallback(() => setOpen(false), []);

  // 🔥 LOGOUT limpio (sin flicker)
  const handleLogout = useCallback(() => {
    setOpen(false);

    navigate("/login", { replace: true }); // 🔥 primero navega
    logout(); // 🔥 luego limpia estado

    toast.success("Sesión cerrada correctamente 👋", {
      position: "top-right",
      autoClose: 2000,
    });
  }, [logout, navigate]);

  const textColor = () => "#fff";

  const UserSection = ({ showLogout = true, mobile = false }) =>
    isAuthenticated && (
      <Stack
        direction={mobile ? "column" : "row"}
        spacing={1.5}
        alignItems="center"
        sx={styles.userSection(mobile)}
      >
        <AccountCircleIcon sx={{ color: textColor() }} />

        <Typography sx={{ color: textColor(), fontWeight: 600 }}>
          {user?.username}
        </Typography>

        {showLogout && (
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={(theme) => styles.logoutBtn(theme)}
          >
            Cerrar sesión
          </Button>
        )}
      </Stack>
    );

  const MenuList = ({ onClick }) =>
    menu.map((item, idx) => (
      <NavButton key={idx} item={item} onClick={onClick} />
    ));

  return (
    <>
      <MotionAppBar
        position="fixed"
        elevation={scrolled ? 6 : 2}
        sx={(theme) => styles.appBar(theme, scrolled)}
        initial={{ opacity: 0, transform: "translateY(-100%)" }}
        animate={{ opacity: 1, transform: "translateY(0%)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity" }}
      >
        <Toolbar sx={styles.toolbar}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ ...styles.logo, color: textColor() }}
          >
            <ShoppingBagIcon sx={styles.logoIcon} />
            E-commerce Jorge Patricio
          </Typography>

          <Box sx={styles.desktopMenu}>
            <MenuList />

            <IconButton onClick={toggleMode} sx={styles.toggleIcon}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <UserSection />
          </Box>

          <IconButton
            sx={{ ...styles.menuBtnMobile, color: textColor() }}
            onClick={handleToggleMenu}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={open ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                style={styles.iconCenter}
              >
                {open ? (
                  <CloseIcon fontSize="large" />
                ) : (
                  <MenuIcon fontSize="large" />
                )}
              </motion.div>
            </AnimatePresence>
          </IconButton>
        </Toolbar>
      </MotionAppBar>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleCloseMenu}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{
          sx: (theme) => styles.drawerPaper(theme),
        }}
      >
        <Stack sx={styles.drawerStack} spacing={3}>
          <UserSection showLogout={false} mobile />

          <Divider sx={{ opacity: 0.25 }} />

          <MenuList onClick={handleCloseMenu} />

          {isAuthenticated && (
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={(theme) => styles.logoutBtn(theme)}
              >
                Cerrar sesión
              </Button>
            </motion.div>
          )}

          <Stack spacing={2} alignItems="center" sx={styles.drawerUtilStack}>
            <IconButton onClick={toggleMode} sx={styles.toggleIcon}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
