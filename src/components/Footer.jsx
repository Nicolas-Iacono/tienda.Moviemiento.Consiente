import { Grid2, Typography } from '@mui/material'
import React from 'react'
import Image from 'next/image';

export const Footer = () => {
  return (
    <Grid2      sx={{
        backgroundColor: "#C3DE5A",
        color: "#fff",
        textAlign: "center",
        padding: 1,
        marginTop: "auto", // Empuja el footer hacia abajo
        height: "20rem",
        marginTop:"3rem",
        display:"flex",
        flexDirection: "column",
        justifyContent:"space-between",
        alignItems: "center",
      }}
>
            <Image
              src="/Logo/logo-mc.webp"
              alt="Logo"
              width={200}    // valor en píxeles (ejemplo)
              height={100} 
            />
      <Typography variant="h6">Mega Ofertas 2025 | Todos los derechos reservados </Typography>
      </Grid2>
  )
}
