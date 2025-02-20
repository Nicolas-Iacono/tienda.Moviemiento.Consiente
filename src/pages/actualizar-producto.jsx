import { Grid2, CircularProgress, Box } from '@mui/material';
import ProductoUpdateForm from '@/components/formProductUpdate';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import API from '@/utils/api';

const ActualizarProductoPage = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log('ID from query:', id);

  if (!id) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100%'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid2 sx={{ 
      padding: { xs: "20px 0px", md: "20px" }, 
      fontFamily: 'Arial, sans-serif', 
      color: "white", 
      display: "flex", 
      flexDirection: "column",
      marginTop: { xs: "0", md: "0rem" }, 
      height: "auto",
      minHeight: "100vh"
    }}>
      <Grid2 sx={{ width: "100%", display: "flex", flexDirection: "column", height: "auto" }}>
        <Grid2 sx={{
          width: { xs: "100%", md: "80%" },
          height: { xs: "auto", md: "80%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          position: "absolute"
        }}>
          <ProductoUpdateForm productId={id} />
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default ActualizarProductoPage;
