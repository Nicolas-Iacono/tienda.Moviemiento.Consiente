import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useMyUserContext } from "@/context/userContext";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Badge } from "@mui/material";
import { useMyCarritoContext } from "@/context/carritoContext";
import MobileCart from "../cart/MobileCart";
import MenuIcon from '@mui/icons-material/Menu';

const FixedBottomNavigation = () => {
  const [value, setValue] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAdmin, isUser, user } = useMyUserContext();
  const { carrito } = useMyCarritoContext();
  const router = useRouter();

  // Actualizar el valor seleccionado basado en la ruta actual y el tipo de usuario
  useEffect(() => {
    const updateNavigation = () => {
      const path = router.pathname;
      if (isAdmin()) {
        if (path === "/admin") setValue(0);
        else if (path === "/listado") setValue(1);
        else if (path === "/ventas") setValue(2);
        else if (path === "/users") setValue(3);
        else if (path === "/categorias") setValue(4);
      } else {
        if (path === "/user/favorites") setValue(0);
        else if (path === "/") setValue(1);
        else if (path === "/carrito") setValue(2);
      }
    };

    updateNavigation();
  }, [router.pathname, isAdmin]);

  // Redirigir al home si el usuario cambia de tipo (admin/user)
  useEffect(() => {
    const adminPaths = [
      "/admin",
      "/categorias",
      "/listado",
      "/ventas",
      "/users",
    ];
    const isAdminPath = adminPaths.some((path) =>
      router.pathname.startsWith(path)
    );
    
    if (router.pathname !== "/" && !isAdmin() && isAdminPath) {
      router.push("/");
    }
      
    
  }, [isAdmin, router.pathname]);

  const handleNavigation = (path) => {
    if (path === "/carrito") {
      setIsCartOpen(true);
    } else {
      router.push(path);
      console.log("Navegando a:", path);
    }
  };

  const cartItemCount = carrito?.length || 0;

  const mobileMenu = [
    { label: 'Home', path: '/' },
    { label: 'Productos', path: '/products' },
    { label: 'Carrito', path: '/carrito' },
    { label: 'Nosotros', path: '/about' },
    { label: 'Contacto', path: '/contact' },
  ];

  return (
    <>
      <MobileCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          marginTop: "6rem"
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: "15px 15px 0 0",
            overflow: "hidden",
            backgroundColor: "black",
          }}
        >
          {isAdmin() ? (
            <BottomNavigation
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
              sx={{
                height: "60px",
                backgroundColor: "black",
                "& .MuiBottomNavigationAction-root": {
                  color: "white",
                },
                "& .Mui-selected": {
                  color: "#C3DE5A",
                },
              }}
            >
              <BottomNavigationAction
                label="Nuevo"
                icon={<AddCircleRoundedIcon />}
                onClick={() => handleNavigation("/admin")}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.7rem",
                  },
                }}
              />
              <BottomNavigationAction
                label="Inventario"
                icon={<InventoryIcon />}
                onClick={() => handleNavigation("/listado")}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.7rem",
                  },
                }}
              />

              <BottomNavigationAction
                label="Ventas"
                icon={<MonetizationOnIcon />}
                onClick={() => handleNavigation("/ventas")}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.7rem",
                  },
                }}
              />
              <BottomNavigationAction
                label="Usuarios"
                icon={<PeopleAltIcon />}
                onClick={() => handleNavigation("/users")}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.7rem",
                  },
                }}
              />
            </BottomNavigation>
          ) : (
            <BottomNavigation
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
              sx={{
                height: "60px",
                backgroundColor: "black",
                "& .MuiBottomNavigationAction-root": {
                  color: "white",
                },
                "& .Mui-selected": {
                  color: "#C3DE5A",
                },
              }}
            >
              <BottomNavigationAction
                label="Favoritos"
                icon={<FavoriteRoundedIcon />}
                onClick={() => handleNavigation("/user/favorites")}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.7rem",
                  },
                }}
              />
              <BottomNavigationAction
                label="Tienda"
                icon={<StoreIcon />}
                onClick={() => handleNavigation("/")}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.7rem",
                  },
                }}
              />
              <BottomNavigationAction
                label="Carrito"
                icon={
                  <Badge 
                    badgeContent={cartItemCount} 
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: 'black',
                        color: 'white'
                      }
                    }}
                  >
                    <ShoppingCartRoundedIcon />
                  </Badge>
                }
                onClick={() => handleNavigation("/carrito")}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.7rem",
                  },
                }}
              />
            </BottomNavigation>
          )}
        </Paper>
      </motion.div>
    </>
  );
};

export default FixedBottomNavigation;
