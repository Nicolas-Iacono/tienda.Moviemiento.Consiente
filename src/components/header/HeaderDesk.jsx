import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  InputBase,
  IconButton,
  useMediaQuery,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  ListItemIcon
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Logout from "@mui/icons-material/Logout";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { useMyUserContext } from "@/context/userContext";
import MenuCategoria from "../MenuCategoria";
import CarritoCompras from "../CarritoCompras";
import { useRouter } from "next/router";
import SearchBar from "../bucador/SearchBar";
import { useMyCarritoContext } from "@/context/carritoContext"; 

import Image from 'next/image';

export const HeaderDesk = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [carritoView, setCarritoView] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const { isAdmin, isUser } = useMyUserContext();
  const { carrito } = useMyCarritoContext();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    handleClose();
    router.push("./login");
  };

  useEffect(() => {
    const updateUser = () => {
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const user = JSON.parse(userStorage);
        setUser(user);
        setUsername(`${user.first_name} ${user.last_name}`);
      } else {
        setUser(null);
      }
    };

    updateUser();
    window.addEventListener('storage', updateUser);

    return () => {
      window.removeEventListener('storage', updateUser);
    };
  }, [isAdmin, isUser]);

  const verCarrito = () => {
    setCarritoView(!carritoView);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const cartItemCount = carrito?.length || 0;

  return (
    <header className='header-desktop'>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: "#e8621d",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem 1rem",
            minHeight: { xs: "56px", sm: "94px" }
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMenu}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: isMobile ? "auto" : "10rem",
            }}
          >
            <Image
              src="/Logo/LogoMega1.png"
              alt="Logo MegaOfertas"
              width={73}
              height={55}
              onClick={() => router.push("/")}
            />
          </Box>

          {!isMobile && (
            <Box sx={{ flex: 1, mx: 4 }}>
              <SearchBar />
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={() => router.push("/user/favorites")}
                  aria-label="ver favoritos"
                >
                  <FavoriteIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={verCarrito}
                  aria-label="carrito de compras"
                >
                  <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  aria-label="menu de usuario"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      backgroundColor: "#fff",
                      color: "#e8621d"
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {user ? (
                    [
                      <MenuItem key="profile" onClick={() => router.push('/perfil')}>
                        <ListItemIcon>
                          <PersonRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        Mi Perfil
                      </MenuItem>,
                      <MenuItem key="logout" onClick={logOut}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Cerrar Sesión
                      </MenuItem>
                    ]
                  ) : (
                    <MenuItem onClick={() => router.push('/login')}>
                      <ListItemIcon>
                        <LoginRoundedIcon fontSize="small" />
                      </ListItemIcon>
                      Iniciar Sesión
                    </MenuItem>
                  )}
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => router.push("/login")}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2,
                  border: "1px solid #fff"
                }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Toolbar>

        {isMobile && (
          <Box sx={{ px: 2, pb: 1 }}>
            <SearchBar />
          </Box>
        )}
      </AppBar>

      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: "250px",
            backgroundColor: "#fff"
          }
        }}
      >
        <List>
          <ListItem sx={{ justifyContent: "center", mb: 2 }}>
            {/* <Image
              src="/Logo/LogoMega1.png"
              alt="Logo MegaOfertas"
              width={55}
              height={55}
            /> */}
          </ListItem>
          <MenuCategoria onClose={toggleMenu} />
        </List>
      </Drawer>

      {carritoView && (
        <CarritoCompras 
          open={carritoView} 
          onClose={() => setCarritoView(false)} 
        />
      )}

      {/* Espaciador para el AppBar fijo */}
      <Toolbar sx={{ mb: isMobile ? 7 : 2 }} />
    </header>
  );
};

export default HeaderDesk;