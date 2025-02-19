import React, { useState } from "react";
import { Box, IconButton, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useMyCarritoContext } from "@/context/carritoContext";
import SearchBar from "../bucador/SearchBar";
import MobileMenu from "../menu/MobileMenu";
import Image from "next/image";
import { useRouter } from "next/router";

const HeaderMobile = () => {
  const { carrito } = useMyCarritoContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 1rem",
        backgroundColor: "#e8621d",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        height: "60px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          width: "100%",
        }}
      >
        <Image
          src="/Logo/LogoMega1.png"
          alt="Logo"
          width={50}
          height={40}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        />

        <SearchBar />

        <IconButton onClick={() => setMenuOpen(true)} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </Box>
  );
};

export default HeaderMobile;
