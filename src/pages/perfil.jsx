import React, { useState, useEffect } from "react";
import { Typography, Box, Avatar, Divider, IconButton, TextField, Button, Chip } from "@mui/material";
import { Email, Home, Phone, Edit, CameraAlt } from "@mui/icons-material";
import { useMyUserContext } from "@/context/userContext";
import API from "@/utils/api";
import AvatarUploader from "@/components/AvatarUploader";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useMyUserContext();
  const [userStorage, setUserStorage] = useState(null);

  const handleImageUpload = async (urls) => {
    if (!urls?.length || !user?.id) return;

    try {
      const body = {
        profileImage: urls[0]
      };
      await API.put(`/galery/users/${user.id}/galery/profile-image`, body);
      setUserStorage({ 
        ...userStorage, 
        galery: {
          ...userStorage.galery,
          profileImage: urls[0]
        }
      });
    } catch (error) {
      console.error("Error al actualizar el avatar:", error);
    }
  };

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
    API.put(`/users/update/${user.id}`, userStorage)
      .then(() => {
        setIsEditing(false);
        setUser(userStorage);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const [userResponse, galeryResponse] = await Promise.all([
          API.get(`/users/${user.id}`),
          API.get(`/users/${user.id}/galery`).catch(async (error) => {
            if (error.response?.status === 404) {
              console.log("Gallery not found, initializing empty gallery state");
              return { 
                data: {
                  images: [],
                  profileImage: null
                }
              };
            }
            throw error;
          })
        ]);
        
        setUserStorage({
          ...userResponse.data,
          galery: galeryResponse.data
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchUserData();
  }, [user?.id]);

  if (!userStorage) return <Typography sx={{ color: 'white' }}>Cargando...</Typography>;

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
        sx={{ 
          position: "absolute", 
          top: 70, 
          right: 16, 
          color: 'white',
          '&:hover': {
            backgroundColor: ''
          }
        }}
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
          marginTop: "5rem",
        }}
      >
        {/* Avatar y Nombre */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: "primary.main",
                position: "relative"
              }}
              src={userStorage?.galery?.profileImage || null}
            >
              {!userStorage?.galery?.profileImage && `${userStorage.first_name.charAt(0)}${userStorage.last_name.charAt(0)}`}
            </Avatar>
            {isEditing && <AvatarUploader onUploadComplete={handleImageUpload} />}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "start" } }}>
            {isEditing ? (
              <>
                <TextField
                  label="Nombre"
                  name="first_name"
                  value={userStorage.first_name}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                <TextField
                  label="Apellido"
                  name="last_name"
                  value={userStorage.last_name}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
              </>
            ) : (
              <>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                  {userStorage.first_name} {userStorage.last_name}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Registrado el: {new Date(userStorage.registration_date).toLocaleDateString()}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Email */}
        <Box>
          <Typography variant="h6" sx={{ color: 'white' }}>
            <Email fontSize="small" /> Email
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userStorage.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
          ) : (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{userStorage.email}</Typography>
          )}
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Dirección */}
        <Box>
          <Typography variant="h6" sx={{ color: 'white' }}>
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
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              />
              <TextField
                fullWidth
                label="Número"
                name="address.street_number"
                value={userStorage.address.street_number}
                onChange={handleChange}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              />
              <TextField
                fullWidth
                label="Piso"
                name="address.floor"
                value={userStorage.address.floor}
                onChange={handleChange}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              />
              <TextField
                fullWidth
                label="Departamento"
                name="address.apartment"
                value={userStorage.address.apartment}
                onChange={handleChange}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              />
              <TextField
                fullWidth
                label="Ciudad"
                name="address.city_name"
                value={userStorage.address.city_name}
                onChange={handleChange}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              />
              <TextField
                fullWidth
                label="Código Postal"
                name="address.zip_code"
                value={userStorage.address.zip_code}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              />
            </>
          ) : (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {userStorage.address.street_name} {userStorage.address.street_number}, Piso{" "}
              {userStorage.address.floor}, Dpto {userStorage.address.apartment}
            </Typography>
          )}
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Teléfono */}
        <Box>
          <Typography variant="h6" sx={{ color: 'white' }}>
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
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              />
              <TextField
                fullWidth
                label="Número"
                name="phone.number"
                value={userStorage.phone.number}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' }
                }}
              />
            </>
          ) : (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              ({userStorage.phone.area_code}) {userStorage.phone.number}
            </Typography>
          )}
        </Box>

        {isEditing && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, marginBottom: { xs: "3rem" } }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSave}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                px: 4,
                py: 1
              }}
            >
              Guardar
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Perfil;
