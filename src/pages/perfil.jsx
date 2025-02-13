import React, { useState, useEffect } from "react";
import { Typography, Box, Avatar, Divider, IconButton, TextField, Button } from "@mui/material";
import { Email, Home, Phone, Edit } from "@mui/icons-material";
import { useMyUserContext } from "@/context/userContext";
import API from "@/utils/api";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useMyUserContext();
  const [userStorage, setUserStorage] = useState(null);
  console.log(user)
  useEffect(() => {
    API.get(`/users/${user.id}`)
      .then((res) => setUserStorage(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      setUserStorage((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.startsWith("phone.")) {
      setUserStorage((prev) => ({
        ...prev,
        phone: {
          ...prev.phone,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setUserStorage((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    API.post(`/users/update/${user.id}`, userStorage)
      .then(() => {
        setIsEditing(false);
        setUser(res.data);
      })
      .catch((err) => console.error(err));
  };

  if (!userStorage) return <Typography>Cargando...</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: { md: "start", xs: "center" },
        height: "100vh",
        width: "90vw",
        padding: { md: "2rem", xs: "1rem" },
        overflowY: "auto",
      }}
    >
      {/* Botón de edición */}
  <IconButton
        sx={{ position: "absolute", top: 70, right: 10 , widht:"8rem", height:"4rem"}}
        onClick={() => setIsEditing(!isEditing)}
      >
        <Edit />
      </IconButton>

      {/* Contenedor del perfil */}
      <Box
        sx={{
          width: { md: "50%", xs: "90%" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop:"5rem",
        }}
      >
        {/* Avatar y Nombre */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexDirection:{xs:"column", md:"row"} }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", position:"relative"}}>
            {userStorage.first_name.charAt(0)}
            {userStorage.last_name.charAt(0)}
          </Avatar>
          <Box sx={{display:"flex",flexDirection:"column",alignItems:{xs:"center", md:"start"}}}>
            {isEditing ? (
              <>
                <TextField
                  label="Nombre"
                  name="first_name"
                  value={userStorage.first_name}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Apellido"
                  name="last_name"
                  value={userStorage.last_name}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </>
            ) : (
              <>
                <Typography variant="h5" fontWeight="bold">
                  {userStorage.first_name} {userStorage.last_name}
                </Typography>
                <Typography color="textSecondary">
                  Registrado el: {new Date(userStorage.registration_date).toLocaleDateString()}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Email */}
        <Box>
          <Typography variant="h6">
            <Email fontSize="small" /> Email
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userStorage.email}
              onChange={handleChange}
            />
          ) : (
            <Typography color="textSecondary">{userStorage.email}</Typography>
          )}
        </Box>

        <Divider />

        {/* Dirección */}
        <Box>
          <Typography variant="h6">
            <Home fontSize="small" /> Dirección
          </Typography>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Calle"
                name="address.street_name"
                value={userStorage.address.street_name}
                onChange={handleChange}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Número"
                name="address.street_number"
                value={userStorage.address.street_number}
                onChange={handleChange}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Piso"
                name="address.floor"
                value={userStorage.address.floor}
                onChange={handleChange}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Departamento"
                name="address.apartment"
                value={userStorage.address.apartment}
                onChange={handleChange}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Ciudad"
                name="address.city_name"
                value={userStorage.address.city_name}
                onChange={handleChange}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Código Postal"
                name="address.zip_code"
                value={userStorage.address.zip_code}
                onChange={handleChange}
              />
            </>
          ) : (
            <Typography color="textSecondary">
              {userStorage.address.street_name} {userStorage.address.street_number}, Piso{" "}
              {userStorage.address.floor}, Dpto {userStorage.address.apartment}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Teléfono */}
        <Box>
          <Typography variant="h6">
            <Phone fontSize="small" /> Teléfono
          </Typography>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Código de Área"
                name="phone.area_code"
                value={userStorage.phone.area_code}
                onChange={handleChange}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Número"
                name="phone.number"
                value={userStorage.phone.number}
                onChange={handleChange}
              />
            </>
          ) : (
            <Typography color="textSecondary">
              ({userStorage.phone.area_code}) {userStorage.phone.number}
            </Typography>
          )}
        </Box>

        {isEditing && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 , marginBottom:{xs:"3rem"}}}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Perfil;
