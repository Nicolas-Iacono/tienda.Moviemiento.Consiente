// pages/shop.js
import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard";

const products = [
  {
    id: 1,
    image: "https://via.placeholder.com/300",
    name: "Producto 1",
    description: "Este es un producto de alta calidad.",
    brand: "Marca A",
    price: 100,
    discount: 20,
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300",
    name: "Producto 2",
    description: "Un producto increíble para tu hogar.",
    brand: "Marca B",
    price: 50,
    discount: 10,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300",
    name: "Producto 3",
    description: "La mejor elección para profesionales.",
    brand: "Marca C",
    price: 75,
    discount: 0,
  },
  {
    id: 4,
    image: "https://via.placeholder.com/300",
    name: "Producto 4",
    description: "La mejor elección para profesionales.",
    brand: "Marca C",
    price: 75,
    discount: 0,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300",
    name: "Producto 3",
    description: "La mejor elección para profesionales.",
    brand: "Marca C",
    price: 75,
    discount: 0,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300",
    name: "Producto 3",
    description: "La mejor elección para profesionales.",
    brand: "Marca C",
    price: 75,
    discount: 0,
  },
];

const Shop = () => {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tienda
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard
              image={product.image}
              name={product.name}
              description={product.description}
              brand={product.brand}
              price={product.price}
              discount={product.discount}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Shop;
