import { Grid2 } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const Fondo = styled(Grid2)(({ theme, isKeyboardOpen, windowHeight }) => ({
  backgroundColor: "#18181F",
  marginLeft: "0px",
  position: "fixed",
  left: 0,
  width: "100%",
  flex: "1",
  zIndex: "-1",
  top: { xs: "0px", md: "50px" },
  minHeight: windowHeight ? `${windowHeight}px` : "100vh",
  height: isKeyboardOpen ? "120vh" : (windowHeight ? `${windowHeight}px` : "100vh"),
  overflowY: "auto",
  transition: "height 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    minHeight: windowHeight ? `${windowHeight}px` : "100vh",
    height: isKeyboardOpen ? "120vh" : (windowHeight ? `${windowHeight}px` : "100vh"),
    paddingBottom: "80px", // Espacio para la barra de navegación
  },
}));

export default function CustomGrid({ children }) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [windowHeight, setWindowHeight] = useState(null);

  useEffect(() => {
    const updateHeight = () => {
      // Usar window.innerHeight para dispositivos iOS
      // Usar visualViewport.height para dispositivos Android
      const height = window.visualViewport 
        ? window.visualViewport.height 
        : window.innerHeight;
      setWindowHeight(height);
    };

    const detectKeyboard = () => {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const isOpen = visualViewport.height < window.innerHeight;
        setIsKeyboardOpen(isOpen);
        updateHeight();
      }
    };

    // Actualizar altura inicial
    updateHeight();

    // Escuchar cambios en el viewport
    window.visualViewport?.addEventListener('resize', detectKeyboard);
    window.addEventListener('resize', updateHeight);

    return () => {
      window.visualViewport?.removeEventListener('resize', detectKeyboard);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <Fondo 
      justifyContent="center" 
      alignItems="center"
      isKeyboardOpen={isKeyboardOpen}
      windowHeight={windowHeight}
    >
      {children}
    </Fondo>
  );
}