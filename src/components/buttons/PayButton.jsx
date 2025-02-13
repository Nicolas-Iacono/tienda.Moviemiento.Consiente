// components/buttons/PayButton.js
import { Button } from '@mui/material';
import React from 'react';
import { useMyUserContext } from '@/context/userContext';
import API from '@/utils/api';
import { useRouter } from 'next/router';

const PayButton = ({ products = [], onSuccess, buttonText = "Comprar", customStyle = {} }) => {
  const router = useRouter();
  const { user } = useMyUserContext();
  
  const handleClick = async () => {
    if (!user) {
      window.alert("Por favor, inicia sesión para continuar con la compra");
      return;
    }

    if (!Array.isArray(products) || products.length === 0) {
      window.alert("No hay productos seleccionados para comprar");
      return;
    }

    try {
      // Convertir los productos al formato esperado por la API
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.nombre || product.name,
        price: Number(product.precioVenta || product.price || product.precioLista),
        quantity: product.quantity || 1
      }));

      const orderPayload = {
        userId: user.id,
        products: formattedProducts
      };

      console.log("Enviando orden:", orderPayload);
      
      const response = await API.post(`/orders/crearorden`, orderPayload);
      
      if (onSuccess) onSuccess(response.data);
      
      console.log("Respuesta:", response);
      router.push(response.data.redirect_url);
    } catch (error) {
      console.error("Error al crear la orden:", error);
      window.alert("Hubo un error al procesar tu orden. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      variant="contained" 
      fullWidth
      sx={{ 
        backgroundColor: "#4CAF50",
        '&:hover': {
          backgroundColor: "#388E3C"
        },
        height: "2.5rem", 
        borderRadius: 2,
        ...customStyle
      }}
    >
      {buttonText}
    </Button>
  );
};

export default PayButton;