import React from 'react';
import { IconButton, Tooltip, Zoom } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppButton = ({ phoneNumber = '5491134606666', message = 'Hola! Me gustaría obtener más información' }) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Tooltip 
      title="Contactanos por WhatsApp" 
      TransitionComponent={Zoom}
      placement="left"
    >
      <IconButton
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          backgroundColor: '#25D366',
          color: 'white',
          '&:hover': {
            backgroundColor: '#128C7E'
          },
          width: 56,
          height: 56,
          boxShadow: 3,
          zIndex: 1000,
          '@keyframes float': {
            '0%': {
              transform: 'translateY(0px)'
            },
            '50%': {
              transform: 'translateY(-10px)'
            },
            '100%': {
              transform: 'translateY(0px)'
            }
          },
          animation: 'float 3s ease-in-out infinite'
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </IconButton>
    </Tooltip>
  );
};

export default WhatsAppButton;
