import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useMyCarritoContext } from '@/context/carritoContext';
import PayButton from '../buttons/PayButton';
import { useRouter } from 'next/router';

const MobileCart = ({ isOpen, onClose }) => {
  const { carrito, eliminarDelCarrito } = useMyCarritoContext();
  const [dragStart, setDragStart] = useState(null);

  // Calcular el total del carrito
  const total = carrito.reduce((sum, item) => sum + Number(item.precioVenta || item.price), 0);

  const router = useRouter();
  const handleCart = () => {
    router.push('/cart');
    onClose();
  };

  // Manejar el gesto de arrastre
  const handleDragStart = (event, info) => {
    setDragStart(info.point.y);
  };

  const handleDragEnd = (event, info) => {
    if (dragStart && info.point.y > dragStart + 50) {
      onClose();
    }
    setDragStart(null);
  };

  // Cerrar el carrito con la tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handlePaymentSuccess = () => {
    onClose(); // Cerrar el carrito después de una compra exitosa
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'black',
              zIndex: 1000,
            }}
            onClick={onClose}
          />

          {/* Contenedor del carrito */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%', backgroundColor: 'black' }}
            animate={{ 
              y: 0,
              backgroundColor: '#18181F',
              transition: {
                backgroundColor: { duration: 0.3 }
              }
            }}
            exit={{ 
              y: '100%',
              backgroundColor: 'black',
              transition: {
                backgroundColor: { duration: 0.3 }
              }
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1001,
              touchAction: 'none',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }}
          >
            <Paper
              elevation={4}
              sx={{
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'transparent',
              }}
            >
              {/* Barra superior con título y botón de cerrar */}
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #363645',
                }}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>Carrito de Compras</Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Lista de productos */}
              <List sx={{ flexGrow: 1, overflowY: 'auto', pb: 0 }}>
                {carrito.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="Tu carrito está vacío" 
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          color: 'white' 
                        } 
                      }} 
                    />
                  </ListItem>
                ) : (
                  carrito.map((item) => (
                    <ListItem key={item.id} sx={{ backgroundColor: '#18181F', mb: 1 }}>
                      <ListItemText
                        primary={item.nombre || item.name}
                        secondary={`$${Number(item.precioVenta || item.price).toLocaleString()}`}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            color: 'white' 
                          },
                          '& .MuiListItemText-secondary': { 
                            color: '#C3DE5A' 
                          } 
                        }}
                      />
                        <IconButton
                          edge="end"
                          onClick={() => eliminarDelCarrito(item.id)}
                          sx={{ color: 'white' }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                    </ListItem>
                  ))
                )}
              </List>

              {/* Total y botón de pago */}
              {carrito.length > 0 && (
                <Box sx={{ p: 2, borderTop: '1px solid #363645' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                    Total: ${total.toLocaleString()}
                  </Typography>
                  <Button 
                    sx={{
                      width:"100%", 
                      height:"2rem", 
                      backgroundColor:"#C3DE5A", 
                      color:"black",
                      '&:hover': {
                        backgroundColor: '#A1BC48'
                      }
                    }}
                    onClick={handleCart} 
                    products={carrito}
                    onSuccess={handlePaymentSuccess}
                    buttonText="Ver mi carrito"
                  >
                    <Typography>
                    Ver mi carrito
                    </Typography>
                  </Button>
                </Box>
              )}
            </Paper>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileCart;
