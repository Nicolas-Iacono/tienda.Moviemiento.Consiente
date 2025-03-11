import React, { useEffect, useState } from 'react';
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
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
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
import API from '@/utils/api';



const MobileMenu = ({ open, onClose }) => {
  const router = useRouter();
  const { user, logout, setUser } = useMyUserContext();
  const [logued, setLogued] = useState(false);
  const [userStorage, setUserStorage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userLogued = localStorage.getItem("user");
    setLogued(!!userLogued);

    const fetchUserData = async () => {
      try {
        const response = await API.get(`/users/${user.id}`);
        setUserStorage(response.data);
        setIsAdmin(response.data?.authorities?.includes("ROLE_ADMIN"));
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  console.log("sesion",logued ? "INICIADA":"NO INICIADA");

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
  const handleBlog = () => {
    router.push("/blog")
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
                bgcolor: "primary.main",
                margin: '0 auto',
              }}
              src={userStorage?.galery?.profileImage || null}
            >
              {!userStorage?.galery?.profileImage && `${userStorage?.first_name?.charAt(0)}${userStorage?.last_name?.charAt(0)}`}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 1, color: 'white' }}>
              {userStorage?.first_name} {userStorage?.last_name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              {userStorage?.email}
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
              <ListItem button onClick={handleBlog} sx={{ color: 'white' }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <HomeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
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
            <>
            <ListItem button onClick={handleLogin} sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Iniciar Sesión" />
            </ListItem>

            <ListItem button onClick={handleBlog} sx={{ color: 'white' }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <HomeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileMenu;
