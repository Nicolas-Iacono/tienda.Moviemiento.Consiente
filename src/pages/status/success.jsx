import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useRouter } from 'next/router';
import { useMyCarritoContext } from '@/context/carritoContext';

const Success = () => {
  const router = useRouter();
  const { vaciarCarrito } = useMyCarritoContext();

  useEffect(() => {
    // Limpiar el carrito después de una compra exitosa
    vaciarCarrito();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 80,
              color: '#4CAF50',
              mb: 2,
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            ¡Pago Exitoso!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ¡Gracias por tu compra! Tu pedido ha sido procesado correctamente.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Recibirás un correo electrónico con los detalles de tu compra y el seguimiento de tu pedido.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => router.push('/')}
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': {
                  bgcolor: '#388E3C',
                },
              }}
            >
              Volver al Inicio
            </Button>
            {/* <Button
              variant="outlined"
              onClick={() => router.push('/user/orders')}
              sx={{
                color: '#4CAF50',
                borderColor: '#4CAF50',
                '&:hover': {
                  borderColor: '#388E3C',
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                },
              }}
            >
              Ver Mis Pedidos
            </Button> */}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Success;