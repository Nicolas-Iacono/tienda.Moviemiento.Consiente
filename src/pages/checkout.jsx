import { useState, useEffect } from "react";
import CheckoutButton from "../components/buttons/CheckoutButton";
import axios from "axios";
import { Grid2, Typography } from "@mui/material";
import API from "@/utils/api";

const CheckoutPage = () => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    API.post(`${process.env.NEXT_PUBLIC_API_URL}/create_preference`, {
      title: "Producto de prueba",
      price: 1000,
      quantity: 1
    })
    .then(response => {
      setPreferenceId(response.data.preferenceId);
    })
    .catch(error => console.error("Error al crear la preferencia", error));
  }, []);

  return (
    <Grid2>
      <Typography variant="h1">Checkout</Typography>
      {preferenceId ? <CheckoutButton preferenceId={preferenceId} /> : <Typography variant="body1">Cargando...</Typography>}
    </Grid2>
  );
};

export default CheckoutPage;
