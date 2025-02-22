import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Login as LoginIcon,
  Close as CloseIcon,
  AccountCircle as AccountCircleIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useMyUserContext } from '@/context/userContext';
import { useEffect, useState } from 'react';

const MobileMenu = ({ open, onClose }) => {
  const router = useRouter();
  const { user, logout } = useMyUserContext();

  const[logued, setLogued] = useState(false);

  useEffect(() => {
    const userLogued = localStorage.getItem("user");
    setLogued(!!userLogued);
  },[]);
  

  console.log("sesion",logued ? "INICIADA":"NO INICIADA");

  const [isAdmin,setIsAdmin] = useState(false);

  useEffect(() => {
    if(user.authorities[0] === "ROLE_ADMIN")
    setIsAdmin(true);
    else
    setIsAdmin(false);
  }, [user]);
  
  const handleLogout = () => {
    logout();
    onClose();
    router.push("/login");
  };

  const handleLogin = () => {
    router.push('/login');
    onClose();
  };

  const handleProfile = () => {
    router.push('/perfil');
    onClose();
  };

  const handleCart = () => {
    router.push('/cart');
    onClose();
  };

  const handleCategory = () => {
    router.push("/categorias")
    onClose();
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '70%',
          maxWidth: '300px',
          bgcolor: '#18181F',
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
        },
      }}
      SlideProps={{
        timeout: 300,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} size="large" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {user ? (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto',
                bgcolor: 'primary.main',
              }}
            >
              {user.first_name?.[0]?.toUpperCase() || <PersonIcon />}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 1, color: 'white' }}>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              {user.email}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto',
                bgcolor: 'grey.300',
              }}
            >
              <PersonIcon />
            </Avatar>
            <Typography variant="h6" sx={{ mt: 1, color: 'white' }}>
              Invitado
            </Typography>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              fullWidth
              sx={{ mt: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <List>
          {user && logued && (
            <>
              <ListItem button onClick={handleProfile} sx={{ color: 'white' }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Mi Perfil" />
              </ListItem>
              <ListItem button onClick={handleCart} sx={{ color: 'white' }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Carrito" />
              </ListItem>
              
            </>
          )}

          {isAdmin && (
            <ListItem button onClick={handleCategory} sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Categorias" />
            </ListItem>
          )}

          {logued && (
            <ListItem button onClick={handleLogout} sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItem>
          )}

          {!logued && (
            <ListItem button onClick={handleLogin} sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Iniciar Sesión" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileMenu;
