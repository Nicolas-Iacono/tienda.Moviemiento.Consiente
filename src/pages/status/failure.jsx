import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/router';

const Failure = () => {
  const router = useRouter();

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
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: '#f44336',
              mb: 2,
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Pago No Completado
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Lo sentimos, ha ocurrido un error al procesar tu pago.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Posibles razones:
          </Typography>
          <Box sx={{ mb: 3, textAlign: 'left', pl: 4 }}>
            <Typography variant="body2" color="text.secondary" component="ul">
              <li>Fondos insuficientes en la tarjeta</li>
              <li>Datos de la tarjeta incorrectos</li>
              <li>Problema de conexión durante el proceso</li>
              <li>La transacción fue rechazada por el banco</li>
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Por favor, verifica los datos e intenta nuevamente.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => router.back()}
              sx={{
                bgcolor: '#f44336',
                '&:hover': {
                  bgcolor: '#d32f2f',
                },
              }}
            >
              Intentar Nuevamente
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/')}
              sx={{
                color: '#f44336',
                borderColor: '#f44336',
                '&:hover': {
                  borderColor: '#d32f2f',
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                },
              }}
            >
              Volver al Inicio
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Failure;