import { Paper, Typography, Box } from '@mui/material'
import React from 'react'
import Image from 'next/image'

const TarjetaCategoria = React.memo(({ categoria }) => {
  return (
    <Paper 
      elevation={3}
      sx={{
        width: { xs: "100%", md: "18rem" },
        height: { xs: "10rem", md: "100%" },
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "10px",
        overflow: "hidden",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        }
      }}
    >
      <Box
        sx={{
          padding: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1
        }}
      >
        <Typography 
          variant='h6' 
          sx={{
            fontWeight: 600,
            fontStyle: "oblique",
            color: "#2c3e50",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}
        >
          {categoria.name}
        </Typography>
      </Box>

      <Box 
        sx={{
          width: "40%",
          height: "100%",
          position: "relative",
          backgroundColor: "#f8f9fa",
          borderLeft: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Box
          component="div"
          sx={{
            position: "relative",
            width: "80px",
            height: "80px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)"
            }
          }}
        >
          <Image
            src={categoria.img}
            alt={categoria.name}
            layout="fill"
            objectFit="contain"
            quality={90}
            priority={true}
          />
        </Box>
      </Box>
    </Paper>
  )
});

TarjetaCategoria.displayName = 'TarjetaCategoria';
export default TarjetaCategoria;