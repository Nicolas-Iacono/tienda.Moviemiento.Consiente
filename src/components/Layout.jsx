import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import dynamic from "next/dynamic";
import Fondo from "../components/Fondo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import FixedBottomNavigation from "../components/navigation/FixedBottomNavigation";
import WhatsAppButton from "./WhatsAppButton";

const Layout = ({ children }) => {
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: '#000'
    }}>
      {mobile ? (
        <>
          <Header />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: "100%",
              overflowY: "auto",
              paddingBottom: "80px", 
              WebkitOverflowScrolling: "touch", 
              position: 'relative',
              zIndex: 1
            }}
          >
            <Fondo>{children}</Fondo>
          </Box>
          <Box
            component="nav"
            sx={{
              width: "100%",
              position: "fixed",
              bottom: 0,
              left: 0,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(10px)",
              zIndex: 10
            }}
          >
            <FixedBottomNavigation />
          </Box>
          <WhatsAppButton phoneNumber="5491144952863" />
        </>
      ) : (
        <>
          <Header />
          <Container 
            component="main"
            maxWidth="lg"
            sx={{
              flexGrow: 1,
              position: 'relative',
              zIndex: 1
            }}
          >
            <Fondo>{children}</Fondo>
          </Container>
          <WhatsAppButton phoneNumber="5491144952863" />
        </>
      )}
    </Box>
  );
};

export default dynamic(() => Promise.resolve(Layout), { ssr: false });
