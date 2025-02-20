import Link from "next/link";
import { useRouter } from "next/router";
import API from '../utils/api';
import { Card, CardMedia, CardContent, Typography, CardActions, IconButton, Box, Button } from "@mui/material";
import { useCategory } from "@/context/categoryContext";
import { useMyCarritoContext } from "@/context/carritoContext";
import { useMyUserContext } from "@/context/userContext";
import ProductLikeButton from "./buttons/ProductLikeButton";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

const ProductCard = ({ producto }) => {
  const { category } = useCategory();
  const { agregarAlCarrito, carrito } = useMyCarritoContext();
  const { user } = useMyUserContext();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);

  // Verificar si el producto está en el carrito al cargar el componente
  useEffect(() => {
    const productoEnCarrito = carrito.some(item => item.id === producto.id);
    setIsAdded(productoEnCarrito);
  }, [carrito, producto.id]);

  const handleCardClick = () => {
    router.push(`/product/${producto.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevenir que el click se propague a la tarjeta
    
    if (!user?.email) {
      Swal.fire({
        title: 'Inicio de sesión requerido',
        text: 'Debes iniciar sesión para agregar productos al carrito',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Ir a login',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    agregarAlCarrito(producto);
    setIsAdded(true);
  };

  return (
    <Card 
      elevation={1}
      onClick={handleCardClick}
      sx={{
        width: {
          xs: '150px',
          sm: '160px',
          md: '350px'
        },
        display: "flex",
        flexDirection: "column",
        height: {
          xs: '250px',
          sm: '300px',
          md: '420px'
        },
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: { xs: '120px', sm: '160px', md: '280px' },
        p: { xs: 1, sm: 1.5, md: 2 },
        boxSizing: 'border-box'
      }}>
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            backgroundColor: '#f5f5f5',
            display: 'block',
            margin: 0,
            padding: 0,
            borderRadius: '16px',
            boxSizing: 'border-box'
          }}
          image={producto.imagenes?.[0] || producto.images?.[0]}
          title={producto.nombre || producto.name}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 7,
            right: 7,
            padding: '1rem',
          }}
        >
          <ProductLikeButton 
            productId={producto.id}
            sx={{
              backgroundColor: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
              zIndex: 1
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ 
        flexGrow: 1,
        p: { xs: 1, sm: 1.5, md: 2 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: { xs: '90px', sm: '100px', md: '100px' },
        '&:last-child': { pb: 1 }
      }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{
            fontSize: { xs: '0.9rem', sm: '0.8rem', md: '1rem' },
            fontWeight: 700,
            height: { xs: '32px', sm: '40px', md: '48px' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: { xs: '16px', sm: '20px', md: '24px' },
          }}
        >
          {producto.nombre || producto.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.87rem', sm: '0.875rem', md: '1rem' },
            fontWeight: 'bold',
            textAlign: 'left'
          }}
        >
          ${producto.precio || producto.price}
        </Typography>
      </CardContent>

      <Button
        variant="contained"
        onClick={handleAddToCart}
        startIcon={<AddShoppingCartIcon sx={{ fontSize: '1.2rem' }} />}
        sx={{
          width: '100%',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          py: 0.5,
          minHeight: '32px',
          fontSize: '0.75rem',
          textTransform: 'none',
          whiteSpace: 'nowrap',
          backgroundColor: isAdded ? '#4CAF50' : undefined,
          '&:hover': {
            backgroundColor: isAdded ? '#45a049' : undefined
          }
        }}
      >
        {isAdded ? 'Added to Cart' : 'Add to Cart'}
      </Button>
    </Card>
  );
};

export default ProductCard;
