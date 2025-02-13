import React from "react";
import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material";
import Image from 'next/image';


const Categorias = () => {
  const catData = [
    {
      id: 1,
      name: "iPhone",
      image: "categorias/logos/iphone.png",
    },
    {
      id: 2,
      name: "Mates",
      image: "categorias/logos/mate.png",
    },
    {
      id: 3,
      name: "Vape",
      image: "categorias/logos/vape.png",
    },
  ];

  return (
    <Box container spacing={3} justifyContent="center" sx={{display:"flex",gap:"3rem"}}>
      {catData.map((item) => (
        <Box
          key={item.id}
          xs={12}
          sm={6}
          md={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              borderRadius: "30px",
              backgroundColor:"white",
              width: "5rem",
              height: "5rem",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              border:"2px solid orange",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
            }}
            alt={item.name} // Accesibilidad
          >

            <Image src={item.image} alt="" width="50px"/>
          </Box>
          <Typography
            variant="body2"
            sx={{ marginTop: "1rem", textAlign: "center", fontWeight: "bold" }}
          >
            {item.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Categorias;
