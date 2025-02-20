import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/slideStyles.css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useRouter } from "next/router";
import { Typography, Box, Button, Paper } from "@mui/material";
import API from "@/utils/api";

const Slider = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const handleViewDetails = (id) => {
    router.push(`/product/${id}`);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products/latestfive");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Paper elevation={2} sx={{ borderRadius: "25px", overflow: "hidden" }}>
      <Swiper
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={800}
        slidesPerView={1}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Autoplay, Navigation, Pagination]}
        className="mySwiper"
      >
        {products
          .filter((producto) => producto.disponible)
          .map((product) => (
            <SwiperSlide key={product.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "stretch",
                  backgroundColor: "rgb(255, 240, 234)",
                  height: { xs: "400px", md: "500px" },
                  position: "relative",
                  overflow: "hidden",
                  marginTop:"2rem"
                }}
              >
                {/* Contenido del producto */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    padding: { xs: "1.5rem", md: "3rem" },
                    width: "50%",
                    zIndex: 1,
                    background: "linear-gradient(to right, rgb(255, 240, 234) 60%, transparent)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ 
                      color: "gray",
                      mb: 1,
                      fontSize: { xs: "0.9rem", md: "1.1rem" }
                    }}
                  >
                    {product.brand}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{
                      color: "text.primary",
                      mb: 2,
                      fontSize: { xs: "1.5rem", md: "2.5rem" },
                      fontWeight: "bold"
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{
                      color: "text.secondary",
                      mb: 3,
                      fontSize: { xs: "0.9rem", md: "1rem" }
                    }}
                  >
                    {truncateText(product.descripcion, 120)}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{
                      color: "primary.main",
                      mb: 3,
                      fontSize: { xs: "1.8rem", md: "2.2rem" },
                      fontWeight: "bold"
                    }}
                  >
                    ${product.price}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(product.id)}
                    sx={{
                      borderRadius: "25px",
                      padding: "10px 30px",
                      alignSelf: "flex-start",
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      boxShadow: 3,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s'
                      }
                    }}
                  >
                    Ver más
                  </Button>
                </Box>

                {/* Imagen del producto */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "65%",
                    height: "100%",
                    backgroundImage: product.imagenes?.length > 0
                      ? `url(${product.imagenes[0]})`
                      : `url('/default-image-url.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
      </Swiper>
    </Paper>
  );
};

export default Slider;
