import React, { useEffect, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Box, Button, Paper, Typography} from '@mui/material';
import { useRouter } from "next/router";
import API from '@/utils/api';
import Image from 'next/image';

export const VerticalSlider = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();


  const handleViewDetails = (id) => {
    router.push(`/product/${id}`);
  };


  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products/latestfive');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: '100%', 
        width:"100%",
        padding: '4rem',
        backgroundColor:"#FFBA9E",
       position: 'relative',
       margin:"0 auto",
       borderRadius:"10px",
        gap: '2rem',
      }}
    >


      <Box sx={{width:"40%", height:"15rem" ,display:{xs:"none",md:"flex"}}}>
          <Typography variant='h2' style={{fontWeight:"100",fontStyle:"oblique"}}>
            NUEVAS  <span style={{fontWeight:"800",fontStyle:"oblique", color:"#5105E8"}}>OFERTAS TODOS</span> LOS DIAS
          </Typography>
        
      </Box>

      <Splide
      style={{position:"relative"}}
        options={{
          direction: 'ttb', // Vertical slider
          height: '25rem',
          type: 'loop',
          perPage: 1,
          autoplay: true,
          gap: '1rem',
          width: '100%',
          arrows: false, // Desactiva los botones de control
        
        }}
      >
        {products.map((product) => (
          <SplideSlide key={product.id}>
            <Paper
            elevation={9}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                width:"95%",
                height:"24rem"
                
                
              }}
            >
              {/* First Row */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '4rem',
                  justifyContent: 'space-between',
                  alignItems:"center",
                  height: '100%'
                }}
              >
                {/* Column 1 */}
                <Box sx={{ display:"flex" , justifyContent:"space-between",flexDirection:"column",padding:"2rem",width:"47%", height:"90%"}}>
                  <Typography variant="body1" fontWeight="bold" sx={{color:"gray"}}>
                    {product.brand}
                  </Typography>
                  <Typography variant="h4" color="textSecondary">
                    {product.name}
                  </Typography>
                  <Typography variant="body3" color="textSecondary">
                    {truncateText(product.descripcion, 60)}
                  </Typography>
                  <Typography variant="h5" color="primary" mt="0.5rem">
                    ${product.price}
                  </Typography>

                   {/* Second Row */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Button variant="contained" color="primary"
                onClick={() => handleViewDetails(product.id)}>
                  Ver más
                </Button>
              </Box>
                </Box>

                {/* Column 2 */}
                <Box
                  sx={{
                    flex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    width:{md:"25rem", xs:"100%"},
                    justifyContent: 'center',
                    backgroundColor: 'black',
                    borderRadius:3,
                    height:{md:"19rem", xs:"100%"}

                  }}
                >
                  <Image
                    src={
                      product.imagenes && product.imagenes.length > 0
                        ? product.imagenes[0]
                        : 'default-image-url.jpg'
                    }
                    alt={product.name}
                    style={{
                      width:"100%",
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '10px',

                    }}
                  />
                </Box>
              </Box>

             
            </Paper>
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  );
};

export default VerticalSlider;
