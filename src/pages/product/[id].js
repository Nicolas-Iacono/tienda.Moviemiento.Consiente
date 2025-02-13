import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { Container, Typography, Box, CardMedia, Button, IconButton } from "@mui/material";
import API from "../../utils/api";
import { useMyCarritoContext } from "@/context/carritoContext";
import getLocalStorage from "../../helper/getLocalStorage";
import LikeButton from "../../components/buttons/ProductLikeButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from 'next/image';
import Swal from 'sweetalert2';
import ProductDesk from "./ProductDesk";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [imgSelected, setImgSelected] = useState(0);
  const [likeBtn, setLikeBtn] = useState(false);
  const { carrito, agregarAlCarrito } = useMyCarritoContext();
  const [user, setUser] = useState(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = getLocalStorage("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const userId = user ? user.id : null;

  const isInCart = useMemo(() => {
    return carrito.some(item => item.id === product?.id);
  }, [carrito, product]);

  const handleAddToCart = (product) => {
    if (!isInCart) {
      const normalizedProduct = {
        id: product.id,
        name: product.nombre,
        brand: product.marca,
        price: product.precioVenta,
        imagenes: product.imagenes,
        description: product.descripcion,
        cantidad: 1
      };
      agregarAlCarrito(normalizedProduct);
      Swal.fire({
        title: "¡Producto agregado!",
        text: "El producto se agregó al carrito correctamente",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "orange",
      });
    }
  };

  const handleImageClick = (index) => {
    setImgSelected(index);
  };

  useEffect(() => {
    if (id) {
      API.get(`/products/producto/${id}`)
        .then((response) => setProduct(response.data))
        .catch((error) => console.error("Error al cargar el producto:", error));
    }
  }, [id]);

  if (!product) {
    return (
      <Container sx={{ marginTop: 4, textAlign: "center" }}>
        <Typography variant="h4" color="error">
          Producto no encontrado
        </Typography>
        <Button onClick={() => router.push("/shop")} variant="contained" sx={{ marginTop: 2 }}>
          Volver a la tienda
        </Button>
      </Container>
    );
  }

  return (
    <>
      {mobile ? (
        <Container sx={{ marginTop: "4rem" }}>
          <IconButton onClick={() => router.back()} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" }, justifyContent: "start", alignItems: "center", height: { md: "33rem" } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "5rem", width: "100%" }}>
              <Box sx={{ display: "flex", flexDirection: "column", width: "90%", alignItems: "start", height: "100%", justifyContent: "space-around" }}>
                <Typography variant="subtitle1" color="gray" sx={{ fontWeight: 700 }}>
                  {product.marca}
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ width: "100%", color: "rgb(69, 69, 69)" }}>
                  {product.nombre}
                </Typography>
              </Box>
              <Box sx={{ height: "5rem" }}>
                <LikeButton productId={product.id} userId={userId} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { md: "row", xs: "column-reverse" }, width: { md: "33rem", xs: "100%" }, height: { md: "90%", xs: "30rem" }, justifyContent: "space-between" }}>
              <Box sx={{ width: { xs: "100%", md: "7rem" }, height: { xs: "8rem" }, display: "flex", flexDirection: { xs: "row", md: "column" }, justifyContent: "start", alignItems: "center", gap: ".4rem", marginTop: { xs: "1rem", md: "0px" }, overflowX: "auto" }}>
                {product && product.imagenes && product.imagenes.map((imagen, index) => (
                  <CardMedia key={index}
                    component="img"
                    image={imagen}
                    onClick={() => handleImageClick(index)}
                    sx={{ width: { xs: `calc(100% / ${product.imagenes.length} - 0.5rem)`, md: "80%" }, height: { xs: "4rem" }, minWidth: "3rem", borderRadius: "5px", cursor: "pointer" }}
                  />
                ))}
              </Box>
              <Box sx={{ width: { xs: "100%" } }}>
                <CardMedia
                  component="img"
                  image={product.imagenes[imgSelected]}
                  alt={product.name}
                  sx={{ width: { xs: "100%", md: "70%" }, height: { xs: "25rem", md: "90%" }, borderRadius: 2, margin: "auto", fitObject: "container" }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "white", height: "85%", padding: "1rem", justifyContent: "space-between", width: { md: "50%", xs: "100%" }, marginBottom: "5rem" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: "400", color: "gray" }}>
                  {product.descripcion}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "3rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "1rem"
                }}
              >
                <Box
                  sx={{
                    backgroundImage: `url('/mediosPagos/visa.webp')`,
                    width: "3rem",
                    height: "80%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    border: ".1px solid gray",
                    borderRadius: 2
                  }}
                ></Box>
                <Box
                  sx={{
                    backgroundImage: `url('/mediosPagos/master.webp')`,
                    width: "3rem",
                    height: "80%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    border: ".1px solid gray",
                    borderRadius: 2
                  }}
                ></Box>
                <Box
                  sx={{
                    backgroundImage: `url('/mediosPagos/mercadoPago.webp')`,
                    width: "3rem",
                    height: "80%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    border: ".1px solid gray",
                    borderRadius: 2
                  }}
                ></Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "start"
                }}
              >
                <Typography variant="h4" sx={{ textDecoration: product.descuento ? "line-through" : "none" }}>
                  <span style={{ color: "orange" }}>$</span>{product.precioLista}
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
      ) : (
        <ProductDesk
          product={product}
          imgSelected={imgSelected}
          handleImageClick={handleImageClick}
          handleAddToCart={handleAddToCart}
          isInCart={isInCart}
        />
      )}
    </>
  );
};

export default ProductDetails;
