import React from 'react';
import { Container, Typography, Box, CardMedia, Button, IconButton } from "@mui/material";
import LikeButton from "../../components/buttons/ProductLikeButton";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";

const ProductDesk = ({ product, imgSelected, handleImageClick, handleAddToCart, isInCart }) => {
  const router = useRouter();
  
  return (
    <Container sx={{ 
      marginTop: {xs: 16, md: 10},
      minHeight: "100vh",
      height: "auto",
      paddingBottom: "4rem",
      display: "flex",
      flexDirection: "column"
    }}>
      <Box sx={{
        position: "fixed",
        top: "5rem",
        left: "2rem",
        zIndex: 10
      }}>
        <IconButton 
          onClick={() => router.back()} 
          color="primary"
          sx={{
            backgroundColor: "rgba(24, 24, 31, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(24, 24, 31, 0.9)",
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ 
        display: "flex", 
        gap: 4, 
        flexDirection: { xs: "column", md: "row" }, 
        justifyContent: "start", 
        alignItems: "flex-start",
        minHeight: "calc(100vh - 10rem)",
        height: "auto",
        mt: 4
      }}>
        {/* Contenedor de imágenes */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: { md: "row", xs: "row" }, 
          width: { md: "50%", xs: "100%" },
          minHeight: { md: "600px", xs: "400px" },
          height: "auto",
          justifyContent: "space-between",
          position: "sticky",
          top: "6rem"
        }}>
          {/* Miniaturas */}
          <Box sx={{ 
            width: { xs: "30%", md: "7rem" }, 
            height: { md: "100%" }, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "start", 
            alignItems: "center", 
            gap: ".8rem",
            overflowY: "auto",
            maxHeight: "600px",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#18181F",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c3de5a",
              borderRadius: "4px",
            }
          }}>
            {product?.imagenes?.map((imagen, index) => (
              <CardMedia
                key={index}
                component="img"
                image={imagen}
                onClick={() => handleImageClick(index)}
                sx={{ 
                  width: { xs: "100%", md: "80%" }, 
                  height: { xs: "5rem" }, 
                  borderRadius: "5px", 
                  cursor: "pointer",
                  border: index === imgSelected ? "2px solid #c3de5a" : "none",
                  transition: "all 0.2s ease"
                }}
              />
            ))}
          </Box>
          
          {/* Imagen principal */}
          <Box sx={{ 
            width: { xs: "70%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <CardMedia
              component="img"
              image={product?.imagenes?.[imgSelected]}
              alt={product?.nombre}
              sx={{ 
                width: "100%",
                maxHeight: "600px",
                borderRadius: 2,
                objectFit: "contain"
              }}
            />
          </Box>
        </Box>

        {/* Información del producto */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          backgroundColor: "#18181F",
          minHeight: { md: "600px" },
          height: "auto",
          padding: "2rem",
          justifyContent: "space-between", 
          width: { md: "50%", xs: "100%" },
          borderRadius: 2,
          gap: 4
        }}>
          {/* Marca y nombre */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            gap: 2
          }}>
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              width: "100%",
              gap: 1
            }}>
              <Typography variant="subtitle1" sx={{ color: "#ADADAD", fontWeight: 700 }}>
                {product?.marca}
              </Typography>
              <Typography variant="h3" sx={{ color: "white" }}>
                {product?.nombre}
              </Typography>
            </Box>
            <LikeButton productId={product?.id} />
          </Box>

          {/* Descripción */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#B3B3B3",
              lineHeight: 1.8,
              fontSize: "1.1rem"
            }}
          >
            {product?.descripcion}
          </Typography>

          {/* Medios de pago */}
          <Box sx={{ 
            display: "flex",
            gap: 2,
            marginTop: "auto"
          }}>
            {["visa.webp", "master.webp", "mercadoPago.webp"].map((img, index) => (
              <Box
                key={index}
                sx={{
                  backgroundImage: `url('/mediosPagos/${img}')`,
                  width: "3rem",
                  height: "2.4rem",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  border: ".1px solid gray",
                  borderRadius: 1,
                  backgroundColor: "white"
                }}
              />
            ))}
          </Box>

          {/* Precio y botón */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column",
            gap: 2
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                textDecoration: product?.descuento ? "line-through" : "none",
                color: "white",
                fontWeight: 600
              }}
            >
              <span style={{ color: "#c3de5a" }}>$</span>{product?.precioLista}
            </Typography>
            <Button
              onClick={() => handleAddToCart(product)}
              variant="contained"
              fullWidth
              startIcon={<AddShoppingCartIcon />}
              disabled={isInCart}
              sx={{
                backgroundColor: isInCart ? "#ADADAD" : "#c3de5a",
                color: "black",
                "&:hover": {
                  backgroundColor: isInCart ? "#ADADAD" : "#96AA44",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#ADADAD",
                  color: "black",
                },
                height: "3.5rem",
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 500
              }}
            >
              {isInCart ? "En el carrito" : "Agregar al carrito"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDesk;
