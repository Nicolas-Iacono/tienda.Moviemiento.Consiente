import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Section = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  backgroundColor: '#f8f8f8',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 'bold',
  color: '#333',
}));

const InstagramButton = styled(IconButton)(({ theme }) => ({
  color: '#E1306C',
  backgroundColor: 'white',
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#E1306C',
    color: 'white',
    transform: 'translateY(-2px)',
  },
  boxShadow: '0 4px 20px rgba(227, 48, 108, 0.15)',
}));

const InstagramFeed = () => {
  return (
    <Section>
      <SectionTitle variant="h2">Síguenos en Instagram</SectionTitle>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <InstagramButton
            href="https://www.instagram.com/gymmovimientoconsciente/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Síguenos en Instagram"
            size="large"
          >
            <InstagramIcon sx={{ fontSize: 40 }} />
          </InstagramButton>
        </motion.div>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#666',
            mt: 2,
            fontWeight: 500
          }}
        >
          @gymmovimientoconsciente
        </Typography>
      </Box>
    </Section>
  );
};

export default InstagramFeed;
