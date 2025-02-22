import { Grid2, Typography, Box, Divider, Button, IconButton, useMediaQuery, useTheme, CircularProgress, Drawer } from '@mui/material'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useMyCarritoContext } from '@/context/carritoContext'
import { useMyUserContext } from "@/context/userContext";
import API from "@/utils/api";
import { useRouter } from "next/router";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

const CarritoCompras = React.memo(({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { carrito, setCarrito, vaciarCarrito, eliminarDelCarrito, incrementarCantidad, decrementarCantidad } = useMyCarritoContext();
  const { user } = useMyUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [loadingItems, setLoadingItems] = useState({})

  const handleQuantityChange = useCallback(async (itemId, increment) => {
    setLoadingItems(prev => ({ ...prev, [itemId]: true }));
    try {
      if (increment > 0) {
        incrementarCantidad(itemId);
      } else {
        decrementarCantidad(itemId);
      }
    } finally {
      setTimeout(() => {
        setLoadingItems(prev => ({ ...prev, [itemId]: false }));
      }, 300);
    }
  }, [incrementarCantidad, decrementarCantidad]);

  const handlePagar = async () => {
    if (!user) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para realizar la compra",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a iniciar sesión",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    try {
      setLoading(true);
      const items = carritoConSubtotales.map(item => ({
        id: item.id,
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const response = await API.post("/payment/create_preference", { items });
      
      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      }
    } catch (error) {
      console.error("Error al crear la preferencia de pago:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al procesar el pago. Por favor, intenta nuevamente.",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const carritoConSubtotales = useMemo(() => {
    return Array.isArray(carrito) ? carrito.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      subtotal: (item.price * (item.quantity || 1))
    })) : [];
  }, [carrito]);

  const subTot = (price, quantity) => 
    (price * quantity);

  const total = useMemo(() => {
    return carritoConSubtotales.reduce((acc, item) => 
      acc + subTot(item.price, item.quantity), 0
    );
  }, [carritoConSubtotales]);

  const CartContent = (
    <Box
      sx={{
        width: isMobile ? "100%" : "30rem",
        height: "100%",
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        padding: 2,
        justifyContent: "space-between",
        gap: "1rem",
        position: isMobile ? "relative" : "absolute",
        right: isMobile ? "auto" : "0px",
        borderRadius: isMobile ? "0" : "0 0 0 60px",
        borderLeft: isMobile ? "none" : "3px solid #C3DE5A",
        borderBottom: isMobile ? "none" : "3px solid #C3DE5A",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: 'white' }}> 
          Mi Carrito
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose} aria-label="cerrar carrito" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{
        display: "flex",
        width: "90%",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0 auto",
        backgroundColor: "#18181F",
        padding: "0.5rem",
        borderRadius: "8px",
        mb: 2
      }}>
        <Typography sx={{ fontWeight: 'medium', color: 'white' }}>Producto</Typography>
        <Typography sx={{ fontWeight: 'medium', color: 'white' }}>Cantidad</Typography>
        <Typography sx={{ fontWeight: 'medium', color: 'white' }}>Precio</Typography>
      </Box>

      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxHeight: isMobile ? "calc(100vh - 250px)" : "calc(80vh - 250px)",
        overflowY: "auto",
        padding: "0.5rem"
      }}>
        {carritoConSubtotales.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
              backgroundColor: "#18181F",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
              <img
                src={item.imagenes?.[0] || "/placeholder.jpg"}
                alt={item.name}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "4px"
                }}
              />
              <Typography sx={{ fontSize: "0.9rem", maxWidth: "150px", color: 'white' }} noWrap>
                {item.name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.id, -1)}
                disabled={loadingItems[item.id]}
                sx={{ color: 'white' }}
              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ color: 'white' }}>{item.quantity}</Typography>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.id, 1)}
                disabled={loadingItems[item.id]}
                sx={{ color: 'white' }}
              >
                <AddIcon />
              </IconButton>
            </Box>
                
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: "80px" }}>
              <Typography sx={{ color: 'white' }}>${subTot(item.price, item.quantity)}</Typography>
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => eliminarDelCarrito(item.id)}
                color="error"
                aria-label="eliminar producto"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>

            {loadingItems[item.id] && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px"
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{
        borderTop: "1px solid #363645",
        padding: "1rem",
        marginTop: "auto"
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, pt: 2 }}>
          <Typography variant="h6" sx={{ color: 'white' }}>Total:</Typography>
          <Typography variant="h6" sx={{ color: 'white' }}>${total}</Typography>
        </Box>
        
        <Button
          variant="contained"
          fullWidth
          onClick={handlePagar}
          disabled={loading || carritoConSubtotales.length === 0}
          sx={{ mt: 2, backgroundColor: '#C3DE5A', color: 'black' }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Pagar"
          )}
        </Button>
      
      </Box>
    </Box>
  );

  return isMobile ? (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "100%",
        }
      }}
    >
      {CartContent}
    </Drawer>
  ) : (
    CartContent
  );
});

CarritoCompras.displayName = 'CarritoCompras';
export default CarritoCompras;