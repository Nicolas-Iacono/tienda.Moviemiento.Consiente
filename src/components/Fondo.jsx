import { Grid2 } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const Fondo = styled(Grid2)(({ theme, isKeyboardOpen }) => ({
  backgroundColor: "#18181F",
  marginLeft: "0px",
  position: "fixed",
  left: 0,
  width: "100%",
  flex: "1",
  zIndex: "-1",
  top: { xs: "0px", md: "50px" },
  minHeight: "100vh",
  height: isKeyboardOpen ? "120vh" : "100vh",
  overflowY: "auto",
  transition: "height 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    minHeight: "100vh",
    height: isKeyboardOpen ? "120vh" : "100vh",
  },
}));

export default function CustomGrid({ children }) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const detectKeyboard = () => {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const isOpen = visualViewport.height < window.innerHeight;
        setIsKeyboardOpen(isOpen);
      }
    };

    window.visualViewport?.addEventListener('resize', detectKeyboard);
    return () => {
      window.visualViewport?.removeEventListener('resize', detectKeyboard);
    };
  }, []);

  return (
    <Fondo 
      justifyContent="center" 
      alignItems="center"
      isKeyboardOpen={isKeyboardOpen}
    >
      {children}
    </Fondo>
  );
}