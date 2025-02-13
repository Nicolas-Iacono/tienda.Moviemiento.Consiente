import React, { useState, useEffect } from 'react';
import { Typography, Box, Avatar, Divider, IconButton, TextField, Button } from '@mui/material';
import { Email, Home, Phone, Edit } from '@mui/icons-material';
import { useMyUserContext } from '@/context/userContext';
import API from '@/utils/api';

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { setUser, user } = useMyUserContext();
  const [userStorage, setUserStorage] = useState(null);

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
    API.put(`/users/${user.id}`, userStorage)
      .then(() => setIsEditing(false))
      .catch((err) => console.error(err));
  };

  if (!userStorage) return <Typography>Cargando...</Typography>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        padding: '2rem',
        justifyContent: { xs: 'center', md: 'flex-start' },
        alignItems: { xs: 'center', md: 'flex-start' },
      }}
    >
      <IconButton 
        sx={{ alignSelf: 'flex-end', mb: 2 }} 
        onClick={() => setIsEditing(!isEditing)}
      >
        <Edit />
      </IconButton>

      <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
        {userStorage.first_name.charAt(0)}{userStorage.last_name.charAt(0)}
      </Avatar>

      {isEditing ? (
        <>
          <TextField label="Nombre" name="first_name" value={userStorage.first_name} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
          <TextField label="Apellido" name="last_name" value={userStorage.last_name} onChange={handleChange} fullWidth sx={{ mt: 1 }} />
        </>
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold">{userStorage.first_name} {userStorage.last_name}</Typography>
          <Typography color="textSecondary">Registrado el: {new Date(userStorage.registration_date).toLocaleDateString()}</Typography>
        </>
      )}

      <Divider sx={{ width: '100%', my: 2 }} />

      {/* Email */}
      <Typography variant="h6"><Email fontSize="small" /> Email</Typography>
      {isEditing ? (
        <TextField fullWidth label="Email" name="email" value={userStorage.email} onChange={handleChange} />
      ) : (
        <Typography color="textSecondary">{userStorage.email}</Typography>
      )}

      <Divider sx={{ width: '100%', my: 2 }} />

      {/* Dirección */}
      <Typography variant="h6"><Home fontSize="small" /> Dirección</Typography>
      {isEditing ? (
        <>
          <TextField fullWidth label="Calle" name="address.street_name" value={userStorage.address.street_name} onChange={handleChange} sx={{ mb: 1 }} />
          <TextField fullWidth label="Número" name="address.street_number" value={userStorage.address.street_number} onChange={handleChange} sx={{ mb: 1 }} />
          <TextField fullWidth label="Piso" name="address.floor" value={userStorage.address.floor} onChange={handleChange} sx={{ mb: 1 }} />
          <TextField fullWidth label="Departamento" name="address.apartment" value={userStorage.address.apartment} onChange={handleChange} sx={{ mb: 1 }} />
          <TextField fullWidth label="Ciudad" name="address.city_name" value={userStorage.address.city_name} onChange={handleChange} sx={{ mb: 1 }} />
          <TextField fullWidth label="Código Postal" name="address.zip_code" value={userStorage.address.zip_code} onChange={handleChange} />
        </>
      ) : (
        <Typography color="textSecondary">
          {userStorage.address.street_name} {userStorage.address.street_number}, Piso {userStorage.address.floor}, Dpto {userStorage.address.apartment}
        </Typography>
      )}

      <Divider sx={{ width: '100%', my: 2 }} />

      {/* Teléfono */}
      <Typography variant="h6"><Phone fontSize="small" /> Teléfono</Typography>
      {isEditing ? (
        <>
          <TextField fullWidth label="Código de Área" name="phone.area_code" value={userStorage.phone.area_code} onChange={handleChange} sx={{ mb: 1 }} />
          <TextField fullWidth label="Número" name="phone.number" value={userStorage.phone.number} onChange={handleChange} />
        </>
      ) : (
        <Typography color="textSecondary">({userStorage.phone.area_code}) {userStorage.phone.number}</Typography>
      )}

      {isEditing && (
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
          Guardar
        </Button>
      )}
    </Box>
  );
};

export default Perfil;
