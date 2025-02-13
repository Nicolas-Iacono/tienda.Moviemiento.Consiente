import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Grid2, Button } from "@mui/material";
import Swal from "sweetalert2";
import { useMyUserContext } from "@/context/userContext";
import usuarioApi from "../../data/usuarioApi"; // Ajusta la importación según sea necesario.
import { useRouter } from "next/router";
import API from '@/utils/api';
import Image from 'next/image';

const loginSchema = Yup.object({
  email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria"),
});

const LoginAdminForm = () => {
  const router = useRouter();
  const {user, setUser, isUser,isAdmin} = useMyUserContext();

   // Configuración de Formik
   const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Correo electrónico inválido")
        .required("El correo es obligatorio"),
      password: Yup.string().required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values, { setErrors })  => {
      try {
        // Llamada al endpoint
        const response = await API.post("/users/login", values);
    
        if (response.data.token) {
          // Limpiar cualquier dato del usuario anterior
          localStorage.removeItem("carrito");
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Guardar token y datos del nuevo usuario en localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setUser(response.data.user);
    
          // Verificar el rol directamente desde response.data.user
          if (response.data.user.authorities.includes("ROLE_ADMIN")) {
            Swal.fire({
              title: `Bienvenido ${response.data.user.first_name}`,
              text: "Haz iniciado como administrador",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: `Bienvenido ${response.data.user.first_name}`,
              text: "Haz iniciado sesión",
              icon: "success",
            });
          }
    
          router.push("/");
          console.log("Usuario logueado:", response.data.user);
        } else {
          throw new Error("No se recibió un token.");
        }
      } catch (error) {
        if (error.response) {
          // El servidor respondió con un código de error
          const status = error.response.status;
    
          if (status === 404) {
            setErrors({ email: "El correo no está registrado." });
          } else if (status === 401) {
            setErrors({ password: "La contraseña es incorrecta." });
          } else {
            setErrors({ general: "Error en el servidor. Intenta más tarde." });
          }
        } else {
          // Error de conexión u otro tipo
          setErrors({ general: "No se pudo conectar al servidor." });
        }
      }
  },
});

  return (
    <Grid2 container justifyContent="center" alignItems="center" style={{ height: "100%" }} sx={{display:"flex", flexDirection:"column"}}>
          <Grid2 sx={{height:"18rem", margin:"0 auto", display:"flex", justifyContent:"center", alignItems:"center"}}>
                       
                        <Image
                            src="/Logo/LogoMega1.png"
                            alt="Logo"
                            width={350}
                            height={200}
                            style={{ 
                              width: "350px",
                              height: "auto"
                            }}
                            priority
                            />
                  </Grid2>



      <form onSubmit={formik.handleSubmit} style={{ width: "300px" }}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          variant="filled"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "4px",
            '& .MuiFilledInput-root': {
              backgroundColor: "transparent",
              '&:hover': {
                backgroundColor: "transparent",
              },
              '&.Mui-focused': {
                backgroundColor: "transparent",
              },
              '&::before': {
                borderBottom: 'none',
              },
              '&::after': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: 'none',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#666',
              '&.Mui-focused': {
                color: '#666',
              },
            },
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Contraseña"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          variant="filled"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "4px",
            '& .MuiFilledInput-root': {
              backgroundColor: "transparent",
              '&:hover': {
                backgroundColor: "transparent",
              },
              '&.Mui-focused': {
                backgroundColor: "transparent",
              },
              '&::before': {
                borderBottom: 'none',
              },
              '&::after': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: 'none',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#666',
              '&.Mui-focused': {
                color: '#666',
              },
            },
          }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            marginTop: "2rem",
            backgroundColor: "#513C9C",
            color: "white",
            padding: "0.8rem",
            borderRadius: "4px",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            boxShadow: "none",
            '&:hover': {
              backgroundColor: "#36286A",
              boxShadow: "none",
            },
          }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>
    </Grid2>
  );
};

export default LoginAdminForm;
