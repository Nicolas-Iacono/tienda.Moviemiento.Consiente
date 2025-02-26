import React from 'react';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Grid2, Box, Typography, } from '@mui/material';

const InstagramFeed = () => {
  // Simulated Instagram posts - replace with real Instagram API integration
  const posts = [
    {
      id: 1,
      image: '/blog/insta1.png',
      caption: 'Clase de yoga matutina 🧘‍♀️ #MovimientoConsiente',
      likes: 45,
    },
    {
      id: 2,
      image: '/blog/insta2.png',
      caption: 'Entrenamiento funcional 💪 #Fitness',
      likes: 67,
    },
    {
      id: 3,
      image: '/blog/insta3.png',
      caption: 'Nuevas clases disponibles! 🎉 #MovimientoConsiente',
      likes: 89,
    },
  ];

  return (
    <Section>
      <SectionTitle variant="h2">Síguenos en Instagram</SectionTitle>
      <Box spacing={2}>
        {posts.map((post) => (
          <Box xs={12} sm={6} md={4} key={post.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <PostContainer>
                <PostImage component="img" src={post.image} alt={post.caption} />
                <PostOverlay>
                  <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
                    {post.caption}
                  </Typography>
               
                </PostOverlay>
              </PostContainer>
            </motion.div>
          </Box>
        ))}
      </Box>
    </Section>
  );
};

const Section = styled(Box)({
  padding: '4rem 2rem',
  backgroundColor: '#f8f8f8',
});

const SectionTitle = styled(Typography)({
  textAlign: 'center',
  marginBottom: '2rem',
  color: '#333',
});

const PostContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  paddingBottom: '100%',
  overflow: 'hidden',
  borderRadius: '8px',
});

const PostImage = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const PostOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: 'opacity 0.3s',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem',
  color: 'white',
  '&:hover': {
    opacity: 1,
  },
});

export default InstagramFeed;
