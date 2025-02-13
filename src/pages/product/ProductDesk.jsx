import React from 'react';
import { Container, Typography, Box, CardMedia, Button, IconButton } from "@mui/material";
import LikeButton from "../../components/buttons/ProductLikeButton";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";

const ProductDesk = ({ product, imgSelected, handleImageClick, handleAddToCart, isInCart }) => {
  const router = useRouter();
  
  return (
    <Container sx={{ marginTop: {xs:16,md:10}, height:{md:"40rem"} }}>
      <Box sx={{marginTop:"-3rem"}}>
        <IconButton onClick={() => router.back()} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" }, justifyContent: "start", alignItems: "center", height: { md: "33rem" } }}>
        {/* Contenedor de imágenes */}
        <Box sx={{ display: "flex", flexDirection: { md: "row", xs: "row" }, width: { md: "33rem", xs: "100%" }, height: { md: "90%", xs: "30rem" }, justifyContent: "space-between" }}>
          {/* Miniaturas */}
          <Box sx={{ width: { xs: "30%", md: "7rem" }, height: { md: "100%" }, display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center", gap: ".4rem", marginTop: { xs: "1rem", md: "0px" } }}>
            {product?.imagenes?.map((imagen, index) => (
              <CardMedia
                key={index}
                component="img"
                image={imagen}
                onClick={() => handleImageClick(index)}
                sx={{ width: { xs: "100%", md: "80%" }, height: { xs: "5rem" }, borderRadius: "5px", cursor: "pointer" }}
              />
            ))}
          </Box>
          
          {/* Imagen principal */}
          <Box sx={{ width: { xs: "70%" } }}>
            <CardMedia
              component="img"
              image={product?.imagenes?.[imgSelected]}
              alt={product?.nombre}
              sx={{ width: { xs: "80%", md: "70%" }, height: { xs: "20rem", md: "90%" }, borderRadius: 2, margin: "auto", objectFit: "contain" }}
            />
          </Box>
        </Box>

        {/* Información del producto */}
        <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "white", minHeight: "85%", maxHeight: "115%", padding: "1rem", justifyContent: "space-between", width: { md: "50%", xs: "80%" } }}>
          {/* Marca y nombre */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Typography variant="subtitle1" color="gray" sx={{ fontWeight: 700 }}>
                {product?.marca}
              </Typography>
              <Typography variant="h3" gutterBottom sx={{ width: "100%" }}>
                {product?.nombre}
              </Typography>
            </Box>
            <LikeButton productId={product?.id} />
          </Box>

          {/* Descripción */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "400", color: "gray" }}>
              {product?.descripcion}
            </Typography>
          </Box>

          {/* Medios de pago */}
          <Box sx={{ width: "100%", height: "3rem", display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", gap: "1rem" }}>
            {["visa.webp", "master.webp", "mercadoPago.webp"].map((img, index) => (
              <Box
                key={index}
                sx={{
                  backgroundImage: `url('/mediosPagos/${img}')`,
                  width: "3rem",
                  height: "80%",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  border: ".1px solid gray",
                  borderRadius: 2
                }}
              />
            ))}
          </Box>

          {/* Precio y botón */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" sx={{ textDecoration: product?.descuento ? "line-through" : "none" }}>
              <span style={{ color: "orange" }}>$</span>{product?.precioLista}
            </Typography>
            <Button
              onClick={() => handleAddToCart(product)}
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              disabled={isInCart}
              sx={{
                backgroundColor: isInCart ? "grey.400" : "orange",
                "&:hover": {
                  backgroundColor: isInCart ? "grey.400" : "darkorange"
                },
                height: "2.5rem",
                borderRadius: 3,
                textTransform: "none",
                px: 3
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
