import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Página no encontrada
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/blog')}
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
}
