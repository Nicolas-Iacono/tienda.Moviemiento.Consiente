import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid2,
} from "@mui/material";
import Swal from "sweetalert2";
import API from '@/utils/api';
import Image from 'next/image';

// Esquema de validación con Yup
const UserSchema = Yup.object().shape({
  first_name: Yup.string().required("El nombre es obligatorio"),
  last_name: Yup.string().required("El apellido es obligatorio"),
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: Yup.string().min(6, "Debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
  phone: Yup.object().shape({
    area_code: Yup.string().required("El código de área es obligatorio"),
    number: Yup.string().required("El número es obligatorio"),
  }),
  address: Yup.object().shape({
    zip_code: Yup.string().required("El código postal es obligatorio"),
    street_name: Yup.string().required("El nombre de la calle es obligatorio"),
    street_number: Yup.number().required("El número de calle es obligatorio"),
    city_name: Yup.string().required("El nombre de la ciudad es obligatorio"),
    floor: Yup.string(),
    apartment: Yup.string(),
  }),
});

const API_URL = "http://localhost:5000/users/register";

const UserForm = ({ onRegisterSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Datos Personales",
    "Teléfono",
    "Dirección",
  ];

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      address: { zip_code: "", street_name: "", street_number: "", city_name: "", floor: "", apartment: "" },
      phone: { area_code: "", number: "" },
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      try {
        const response = await API.post("/users/register", values);
        if (response.status === 201 || response.status === 200) {
          await Swal.fire({
            title: "¡Registro exitoso!",
            text: "Te has registrado correctamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
          });
          // Notificar al componente padre que el registro fue exitoso
          onRegisterSuccess();
        }
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.details || 
                           error.response?.data?.error || 
                           error.response?.data?.message || 
                           "Hubo un problema al registrar tus datos";
        
        Swal.fire({
          title: "Error en el registro",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Entendido"
        });
      }
    },
  });

  const handleNext = () => {
    const fieldsToValidate = currentStep === 0
      ? ['first_name', 'last_name', 'email', 'password']
      : currentStep === 1
        ? ['phone.area_code', 'phone.number']
        : ['address.zip_code', 'address.street_name', 'address.street_number', 'address.city_name'];

    const currentErrors = {};
    fieldsToValidate.forEach(field => {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], formik.values)
        : formik.values[field];
      if (!value) {
        currentErrors[field] = `El campo ${field.split('.').pop()} es requerido`;
      }
    });

    if (Object.keys(currentErrors).length > 0) {
      Swal.fire({
        title: 'Campos incompletos',
        html: Object.values(currentErrors).join('<br>'),
        icon: 'warning'
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      formik.handleSubmit();
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (

    <Grid2>
          <Grid2 sx={{height:"11rem", margin:"0 auto", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Image
                    src="/Logo/LogoMega1.png"
                    alt="Logo"
                    width={350}
                    height={200}

                    />
          </Grid2>
    <Box sx={{ maxWidth: "90%", margin: "2rem auto", padding: "2rem", borderRadius: "15px", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        {steps[currentStep]}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        {currentStep === 0 && (
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              <TextField
                name="first_name"
                label="Nombre"
                fullWidth
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
              />
            </Grid2>
            <Grid2
             item xs={12}>
              <TextField
                name="last_name"
                label="Apellido"
                fullWidth
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                name="password"
                label="Contraseña"
                type="password"
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid2>
          </Grid2>
        )}
        {currentStep === 1 && (
          <Grid2 container spacing={2}>
            <Grid2
             item xs={12}>
              <TextField
                name="phone.area_code"
                label="Código de área"
                fullWidth
                value={formik.values.phone.area_code}
                onChange={formik.handleChange}
                error={formik.touched.phone?.area_code && Boolean(formik.errors.phone?.area_code)}
                helperText={formik.touched.phone?.area_code && formik.errors.phone?.area_code}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                name="phone.number"
                label="Número"
                fullWidth
                value={formik.values.phone.number}
                onChange={formik.handleChange}
                error={formik.touched.phone?.number && Boolean(formik.errors.phone?.number)}
                helperText={formik.touched.phone?.number && formik.errors.phone?.number}
              />
            </Grid2>
          </Grid2>
        )}
        {currentStep === 2 && (
          <Grid2
           container spacing={2}>
            <Grid2 item xs={12}>
              <TextField
                name="address.zip_code"
                label="Código Postal"
                fullWidth
                value={formik.values.address.zip_code}
                onChange={formik.handleChange}
                error={formik.touched.address?.zip_code && Boolean(formik.errors.address?.zip_code)}
                helperText={formik.touched.address?.zip_code && formik.errors.address?.zip_code}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                name="address.street_name"
                label="Calle"
                fullWidth
                value={formik.values.address.street_name}
                onChange={formik.handleChange}
                error={formik.touched.address?.street_name && Boolean(formik.errors.address?.street_name)}
                helperText={formik.touched.address?.street_name && formik.errors.address?.street_name}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                name="address.street_number"
                label="Altura"
                fullWidth
                value={formik.values.address.street_number}
                onChange={formik.handleChange}
                error={formik.touched.address?.street_number && Boolean(formik.errors.address?.street_number)}
                helperText={formik.touched.address?.street_number && formik.errors.address?.street_number}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                name="address.city_name"
                label="Ciudad"
                fullWidth
                value={formik.values.address.city_name}
                onChange={formik.handleChange}
                error={formik.touched.address?.city_name && Boolean(formik.errors.address?.city_name)}
                helperText={formik.touched.address?.city_name && formik.errors.address?.city_name}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                name="address.floor"
                label="piso"
                fullWidth
                value={formik.values.address.floor}
                onChange={formik.handleChange}
                error={formik.touched.address?.floor && Boolean(formik.errors.address?.floor)}
                helperText={formik.touched.address?.floor && formik.errors.address?.floor}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                name="address.apartment"
                label="Departamento"
                fullWidth
                value={formik.values.address.apartment}
                onChange={formik.handleChange}
                error={formik.touched.address?.apartment && Boolean(formik.errors.address?.apartment)}
                helperText={formik.touched.address?.apartment && formik.errors.address?.apartment}
              />
            </Grid2>
          </Grid2>
        )}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="secondary"
            disabled={currentStep === 0}
            onClick={handleBack}
          >
            Atrás
          </Button>
          <Button
  variant="contained"
  color="primary"
  onClick={currentStep === steps.length - 1 ? formik.submitForm : handleNext}
>
  {currentStep === steps.length - 1 ? "Registrarse" : "Siguiente"}
</Button>
        </Box>
      </form>
    </Box>
   
    </Grid2>

  );
};

export default UserForm;
