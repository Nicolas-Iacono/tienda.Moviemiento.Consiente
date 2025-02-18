import { useEffect, useState, useCallback, useMemo } from 'react';
import API from '../utils/api';
import { Grid2, Typography, Box, IconButton, Paper } from '@mui/material';
import { useCategory } from "../context/categoryContext";
import ProductCard from '@/components/ProductCard';
import Slider from "../components/slider/Slider";
import { Footer } from '@/components/Footer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const PRODUCTS_PER_PAGE = {
  mobile: 6,
  desktop: 5
};

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const { category, updateCategory } = useCategory();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const productsPerPage = isMobile ? PRODUCTS_PER_PAGE.mobile : PRODUCTS_PER_PAGE.desktop;

  useEffect(() => {
    const handleResize = () => {
      setIsLoading(true);
    };

    if (isInitialLoad) {
      handleResize();
      setIsInitialLoad(false);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isInitialLoad]);

  const { currentProducts, totalPages } = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return {
      currentProducts: productos.slice(indexOfFirstProduct, indexOfLastProduct),
      totalPages: Math.ceil(productos.length / productsPerPage)
    };
  }, [productos, currentPage, productsPerPage]);

  const fetchProductos = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('📦 Iniciando fetch de productos...');
      const response = await API.get('/products/all');
      console.log('✅ Productos recibidos:', response.data.length);
      setProductos(response.data);
      setProductosFiltrados(response.data);
    } catch (error) {
      console.error('❌ Error al cargar productos:', error.message);
      if (error.response) {
        console.error('Detalles del error:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
      } else {
        console.error('Error al configurar la petición:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductosPorCategoria = useCallback(async (categoryId) => {
    if (!categoryId) {
      setProductosFiltrados(productos);
      return;
    }

    try {
      setIsLoading(true);
      const response = await API.get(`/category/${categoryId}`);
      setProductosFiltrados(response.data);
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [productos]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  useEffect(() => {
    fetchProductosPorCategoria(categoriaSeleccionada);
  }, [categoriaSeleccionada, fetchProductosPorCategoria]);

  const handleCategoryChange = useCallback((id) => {
    setCategoriaSeleccionada(id);
    updateCategory({ id });
  }, [updateCategory]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading && isInitialLoad) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography variant="h5">Cargando...</Typography>
      </Box>
    );
  }

  if (category.error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'error.main' 
      }}>
        <Typography variant="h5">Error: {category.error}</Typography>
      </Box>
    );
  }

  return (
    <Grid2 sx={{ 
      color: "white",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      <Box sx={{
        width: { xs: "100%", md: "95%" },
        height: "28rem",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        margin: { xs: "0", md: "20px auto" },
        borderRadius: "25px",
        overflow: "hidden",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)"
        }
      }}>
        <Slider />
      </Box>

      <Grid2 sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "1rem",
        gap: "2rem"
      }}>
        <Grid2 sx={{
          width: { md: "90%", xs: "100%" },
          display: "flex",
          justifyContent: "space-around",
          margin: "0 auto",
          padding: { xs: "0", md: ".5rem" },
          borderRadius: "10px",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          {currentProducts
          .filter(producto => producto.disponible)
          .map((producto) => (
            <Box
              key={producto.id}
              sx={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)"
                }
              }}
            >
              <ProductCard producto={producto} />
            </Box>
          ))}
        </Grid2>

        <Grid2 sx={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "auto",
          paddingBottom: "2rem"
        }}>
          {[...Array(totalPages)].map((_, index) => (
            <IconButton
              key={index}
              onClick={() => handlePageChange(index + 1)}
              sx={{
                backgroundColor: currentPage === index + 1 ? "#e8621d" : "#ff9800",
                width: currentPage === index + 1 ? "3rem" : "2.5rem",
                height: currentPage === index + 1 ? "3rem" : "2.5rem",
                color: "white",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#e65100",
                  transform: "scale(1.1)"
                }
              }}
            >
              {index + 1}
            </IconButton>
          ))}
        </Grid2>
      </Grid2>

      {!isMobile && (
        <Grid2 sx={{
          padding: "2rem 10%"
        }}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: "#3DD34A",
              display: "flex",
              height: "14rem",
              borderRadius: "20px",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
              }
            }}
          >
            <Box sx={{
              width: "50%",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>
              <Typography 
                variant="h2" 
                color="white"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                Canal de difusión
              </Typography>
              <Typography 
                variant="h5" 
                color="black"
                sx={{
                  fontWeight: "medium"
                }}
              >
                Seguinos y enterate de todas las ofertas
              </Typography>
            </Box>
            <Box
              component="img"
              src="/categorias/contacto.png"
              alt="Contacto"
              sx={{
                width: "50%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </Paper>
        </Grid2>
      )}

      {!isMobile && <Footer />}
    </Grid2>
  );
}
