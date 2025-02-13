import Link from "next/link";
import { useRouter } from "next/router";
import API from '../utils/api';
import { Card, CardMedia, CardContent, Typography, CardActions, IconButton, Box } from "@mui/material";
import { useCategory } from "@/context/categoryContext";
import { useMyCarritoContext } from "@/context/carritoContext";
import { useMyUserContext } from "@/context/userContext";
import ProductLikeButton from "./buttons/ProductLikeButton";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Swal from 'sweetalert2';

const ProductCard = ({ producto }) => {
  const { category } = useCategory();
  const { agregarAlCarrito } = useMyCarritoContext();
  const { user } = useMyUserContext();
  const router = useRouter();

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
  };

  return (
    <Card 
      elevation={3}
      onClick={handleCardClick}
      sx={{
        width: {
          md: "15rem", 
          xs: "10rem",
          "@media (max-width: 400px)": { width: "9rem" }
        }, 
        height: {
          md: "22rem", 
          xs: "15rem",
          "@media (max-width: 400px)": { height: "15rem" }
        }, 
        display: "flex", 
        flexDirection: "column", 
        backgroundColor: "white", 
        borderRadius: "15px",
        padding: {
          xs: ".5rem",
          md: "1rem",
          "@media (max-width: 400px)": { padding: ".3rem" }
        },
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }
      }}
    >
      <CardMedia  
        sx={{
          width: "100%", 
          height: "12rem", 
          backgroundPosition: "center center", 
          backgroundRepeat: "no-repeat", 
          backgroundSize: "cover", 
          borderRadius: "12px"
        }}
        image={producto.imagenes?.[0] || producto.images?.[0]}
        title={producto.nombre || producto.name}
      />

      <CardContent sx={{ flexGrow: 1, p: { xs: 1, md: 2 } }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div"
          sx={{
            fontSize: { xs: "0.9rem", md: "1.1rem" },
            fontWeight: "bold",
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {producto.nombre || producto.name}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.8rem", md: "0.9rem" },
            mb: 1
          }}
        >
          {producto.marca || producto.brand}
        </Typography>

        <Typography 
          variant="h6" 
          color="primary"
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            fontWeight: "bold"
          }}
        >
          ${Number(producto.precioVenta || producto.price).toLocaleString()}
        </Typography>
      </CardContent>

      <CardActions 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          p: 1,
          mt: 'auto',
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <IconButton 
          onClick={handleAddToCart}
          sx={{ 
            bgcolor: "rgba(0,0,0,0.03)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.08)",
            },
          }}
        >
          <AddShoppingCartIcon sx={{ color: "#D58420" }} />
        </IconButton>
        <ProductLikeButton productId={producto.id} />
      </CardActions>
    </Card>
  );
};

export default ProductCard;
