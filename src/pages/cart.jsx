import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Grid2,
  Card,
  CardMedia,
  Divider,
} from "@mui/material";
import { useMyCarritoContext } from "@/context/carritoContext";
import { useMyUserContext } from "@/context/userContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import API from "@/utils/api";

const CartPage = () => {
  const router = useRouter();
  const {
    carrito,
    eliminarDelCarrito,
    decrementarCantidad,
    incrementarCantidad,
  } = useMyCarritoContext();
  const { user } = useMyUserContext();
  const [loading, setLoading] = useState(false);
  console.log(user);
  // Calcular el total
  const total = carrito.reduce((acc, item) => {
    const precio = parseFloat(item.price) || 0;
    const cantidad = parseInt(item.cantidad) || 0;
    return acc + precio * cantidad;
  }, 0);

  const handleCheckout = async () => {
    
    useEffect(() => {
      API.get(`/users/${user.id}`)
        .then((res) => setUserStorage(res.data))
        .catch((err) => console.error(err));
    }, []);

    console.log(response)


    try {
      setLoading(true);
      const items = carrito.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: item.cantidad,
        unit_price: item.price,
        description: item.description,
        image: item.imagenes?.[0], // Primera imagen del producto
      }));

      const response = await API.post("/payment/create_preference", { items });
      if (response.data && response.data.init_point) {
        window.location.href = response.data.init_point;
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar el pago. Por favor, intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (productId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminará el producto del carrito",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarDelCarrito(productId);
        Swal.fire(
          "¡Eliminado!",
          "El producto ha sido eliminado del carrito.",
          "success"
        );
      }
    });
  };

  if (carrito.length === 0) {
    return (
      <Container
        sx={{
          mt: 12,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/")}
          sx={{
            backgroundColor: "orange",
            "&:hover": {
              backgroundColor: "darkorange",
            },
          }}
        >
          Ir a comprar
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 12, mb: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Tu Carrito
      </Typography>

      <Grid2
        container
        spacing={9}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "center", md: "space-between" },
        }}
      >
        {/* Lista de productos */}
        <Grid2 item xs={12} md={10} sx={{ width: { xs: "100%", md: "60%" } }}>
          <Card sx={{ p: 2 }}>
            {carrito.map((item, index) => (
              <Box
                key={item.id}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Grid2
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "space-between" },
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "center", nd: "flex-start" },
                  }}
                >
                  <Grid2
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                      justifyContent: "start",
                      width: "auto",
                    }}
                  >
                    {/* Imagen */}
                    <Grid2
                      item
                      xs={3}
                      sm={2}
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <CardMedia
                        component="img"
                        height="100"
                        image={item.imagenes?.[0]}
                        alt={item.name}
                        sx={{ objectFit: "contain", borderRadius: 1 }}
                      />
                    </Grid2>

                    {/* Información del producto */}
                    <Grid2
                      item
                      xs={5}
                      sm={6}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        justifyContent: { xs: "center", md: "start" },
                        alignItems: { xs: "center", md: "flex-start" },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.brand}
                      </Typography>
                    </Grid2>
                  </Grid2>

                  {/* Precio */}
                  <Grid2 item xs={2} sm={2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        ${item.price}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid2>

                  {/* Cantidad */}
                  <Grid2 item xs={2} sm={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => decrementarCantidad(item.id)}
                        disabled={item.cantidad <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.cantidad}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => incrementarCantidad(item.id)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid2>
                </Grid2>
                {index < carrito.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Card>
        </Grid2>

        {/* Resumen y checkout */}
        <Grid2
          item
          xs={12}
          md={4}
          sx={{ marginBottom: { xs: "3rem", md: "1rem" } }}
        >
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumen de compra
            </Typography>
            <Box sx={{ my: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal</Typography>
                <Typography>${total}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Envío</Typography>
                <Typography>Gratis</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${total}</Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCheckout}
              disabled={loading}
              sx={{
                backgroundColor: "orange",
                "&:hover": {
                  backgroundColor: "darkorange",
                },
              }}
            >
              Finalizar compra
            </Button>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default CartPage;
