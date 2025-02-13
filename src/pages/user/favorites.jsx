import { useEffect, useState } from 'react';
import { Box, Typography, Grid2, Container, CircularProgress } from '@mui/material';
import ProductCard from '../../components/ProductCard';
import API from '../../utils/api';
import { useMyUserContext } from '@/context/userContext';

const FavoritesPage = () => {
  const { user } = useMyUserContext();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user) {
          const response = await API.get(`/like/mylikes/${user.id}`);
          // Inicializar products como un array vacío y formatear los datos correctamente
          const products = response.data ? response.data.map(item => ({
            id: item.Product.id,
            nombre: item.Product.name,
            name: item.Product.name,
            imagenes: item.Product.imagenes,
            images: item.Product.imagenes,
            price: item.Product.price,
            priceLista: item.Product.priceLista,
            stock: item.Product.stock,
            descripcion: item.Product.descripcion,
            brand: item.Product.brand,
            likeId: item.id
          })) : [];
          setFavorites(products);
        }
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5" align="center">
          Debes iniciar sesión para ver tus favoritos
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4,
          textAlign: 'center',
          color: 'primary.main'
        }}
      >
        Mis Favoritos
      </Typography>

      {favorites.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No tienes productos favoritos aun
        </Typography>
      ) : (
        <Grid2 container spacing={3}>
          {favorites.map((product) => (
            <Grid2 key={product.id} item xs={12} sm={6} md={4} lg={3}>
               <ProductCard producto={product} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
};

export default FavoritesPage;
