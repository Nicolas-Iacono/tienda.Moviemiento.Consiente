import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import dynamic from "next/dynamic"; // 🔹 Importamos dynamic para deshabilitar SSR
import Fondo from "../components/Fondo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import FixedBottomNavigation from "../components/navigation/FixedBottomNavigation";

const Layout = ({ children }) => {
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false); // 🔹 Para evitar problemas de hidratación

  useEffect(() => {
    setMounted(true); // 🔹 Evita renderizado en SSR
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize(); // Ejecutar al inicio
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null; // 🔹 Evita desajustes en SSR

  return (
    <>
      {mobile ? (
        <>

          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              overflowY: "auto",
            }}
          >
          <Header />

            <Fondo>{children}</Fondo>
          </Box>
          <Box
            sx={{
              width: "100%",
              position: "fixed",
              bottom: 0,
              borderTop: "1px solid #ccc",
            }}
          >
            <FixedBottomNavigation />
          </Box>
          </>
      ) : (
        <>
          <Header />
          <Container maxWidth="lg">
            <Fondo>{children}</Fondo>
          </Container>
        </>
      )}
    </>
  );
};

// 🔹 Deshabilitar SSR para evitar errores de hidratación
export default dynamic(() => Promise.resolve(Layout), { ssr: false });
