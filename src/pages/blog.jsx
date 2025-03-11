import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import HeroSlider from '../components/HeroSlider';
import InstagramFeed from '../components/InstagramFeed';
import ClassSchedule from '../components/ClassSchedule';
import { Container, Grid2, Button, Card, Typography, Box, IconButton, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import StoreIcon from '@mui/icons-material/Store';
import { useRouter } from 'next/router';
import { useMyUserContext } from '../context/userContext';
import API from '@/utils/api';

const Blog = () => {
  const { user } = useMyUserContext();
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);

  const handleRouter = (productId) => {
    router.push(`/product/${productId}`);
  }

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await API.get('/blog/secciones');
        const sectionsData = response.data;
        console.log("Sections data:", sectionsData);
        
        // Filter sections that have valid classes or subscriptions
        const sectionsWithContent = sectionsData.filter(section => {
          const hasValidClasses = Array.isArray(section.clases) && section.clases.length > 0;
          const hasValidSubscriptions = Array.isArray(section.suscripciones) && section.suscripciones.length > 0;
          return hasValidClasses || hasValidSubscriptions;
        });

        console.log("Filtered sections:", sectionsWithContent);
        setSections(sectionsWithContent);
      } catch (error) {
        console.error('Error fetching sections:', error);
        setError('Error al cargar las secciones');
      }
    };
    fetchSections();
  }, []);

  console.log("ES ADMIN" ,user.authorities)
  return (
    <BlogContainer>
      {user.authorities.includes('ROLE_ADMIN') && (
        <Box sx={{ position: 'fixed', top: 70, right: 20, zIndex: 1000, display: 'flex', gap: 1, flexDirection:"column" }}>
          <IconButton
            color="primary"
            sx={{ 
              backgroundColor: 'black',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            onClick={() => router.push('/editBlog')}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="primary"
            sx={{ 
              backgroundColor: 'black',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            onClick={() => router.push('/')}
          >
            <StoreIcon />
          </IconButton>
        </Box>
      )}
      <HeroSlider />
      
      <Section>
        <Container>
          <SectionTitle sx={{ color: 'white' }} variant="h2">Bienvenidos a Movimiento Consiente</SectionTitle>
          <Typography sx={{ color: '#C3DE5A' }} variant="h6" component="p" align="center" gutterBottom>
            Descubre un nuevo nivel de bienestar físico y mental
          </Typography>
        </Container>
      </Section>


      {sections.map((section) => (
        <Section key={section.id} sx={{ backgroundColor: section.clases?.length > 0 ? '#f8f8f8' : 'white', }}>
          <Container sx={{padding:"0 .5rem"}}>
            <SectionTitle variant="h2">{section.nombre}</SectionTitle>
            
            {section.clases && section.clases.length > 0 && (
              <>
                <Grid2 container spacing={4} justifyContent="center" alignItems="stretch">
                  {section.clases.map((clase) => (
                    <Grid2 item xs={12} md={6} key={clase.id} sx={{ display: 'flex'}}>
                      <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }} style={{ width: '100%' }}>
                        <PlanCard 
                          onClick={() => handleRouter(clase.productoId)}
                          sx={{ 
                            position: 'relative', 
                            p: 0, 
                            overflow: 'hidden', 
                            boxShadow: 3,
                            bgcolor: clase.cardBgColor || 'black',
                            color: clase.cardTextColor || 'white',
                            height: '450px',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            borderRadius: '20px'
                          }}
                        >
                          <Box 
                            sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              borderBottom: `2px solid ${clase.cardTextColor ? `${clase.cardTextColor}20` : 'rgba(255,255,255,0.1)'}`,
                            }}
                          >
                            <Typography
                              variant="h2"
                              component="h2"
                              sx={{
                                color: clase.cardTextColor || 'white',
                                fontWeight: 'bold',
                                textAlign: "center",
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                fontSize: { xs: '1.7rem', sm: '2rem' }
                              }}
                            >
                              {clase.nombre}
                            </Typography>
                          </Box>
                          <Box 
                            sx={{ 
                              position: 'relative',
                              flex: '1 1 auto',
                              minHeight: 0,
                              '&::before, &::after': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                height: '40px',
                                zIndex: 1
                              },
                              '&::before': {
                                top: 0,
                                background: `linear-gradient(${clase.cardBgColor || 'rgba(0,0,0,1)'}, transparent)`
                              },
                              '&::after': {
                                bottom: 0,
                                background: `linear-gradient(transparent, ${clase.cardBgColor || 'rgba(0,0,0,1)'})`
                              }
                            }}
                          >
                            <Box
                              component="img"
                              src={Array.isArray(clase.imagen) ? clase.imagen[0] : clase.imagen}
                              alt={clase.nombre}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </Box>
                          <Box 
                            sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              borderTop: `2px solid ${clase.cardTextColor ? `${clase.cardTextColor}20` : 'rgba(255,255,255,0.1)'}`,
                              flex: '0 0 auto'
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: { xs: '1.2rem', sm: '1rem' },
                                lineHeight: 1.5,
                                color: clase.cardTextColor ? `${clase.cardTextColor}CC` : 'rgba(255,255,255,0.9)',
                                margin: '0 auto'
                              }}
                            >
                              {clase.descripcion}
                            </Typography>
                          </Box>
                        </PlanCard>
                      </motion.div>
                    </Grid2>
                  ))}
                </Grid2>
              </>
            )}

            {section.suscripciones && section.suscripciones.length > 0 && (
              <>
                <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Suscripciones</Typography>
                <Grid2 container spacing={4} justifyContent="center" alignItems="stretch">
                  {section.suscripciones.map((subscription) => (
                    <Grid2 item xs={12} md={6} key={subscription.id} sx={{ display: 'flex' }}>
                      <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }} style={{ width: '100%' }}>
                        <PlanCard 
                          sx={{ 
                            height: '450px',
                            width: '100%',
                            bgcolor: subscription.backgroundColor || 'black',
                            color: subscription.textColor || 'white',
                            borderRadius: '20px'
                          }}
                        >
                          <Box sx={{ 
                            p: 3, 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            bgcolor: 'inherit',
                            color: 'inherit'
                          }}>
                            <Typography variant="h2" component="h2" gutterBottom sx={{ 
                              color: subscription.textColor || 'white',
                              textAlign: 'center',
                              fontWeight: 'bold',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              fontSize: { xs: '1.7rem', sm: '2rem' }
                            }}>
                              {subscription.nombre}
                            </Typography>
                            <Typography variant="h4" component="p" sx={{ 
                              color: '#C3DE5A',
                              textAlign: 'center',
                              mb: 3 
                            }}>
                              ${subscription.precio}
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ 
                              flex: 1,
                              color: subscription.textColor ? `${subscription.textColor}CC` : 'rgba(255,255,255,0.9)',
                              textAlign: 'center',
                              fontSize: { xs: '1.2rem', sm: '1rem' }
                            }}>
                              {subscription.descripcion}
                            </Typography>
                            <Box component="ul" sx={{ 
                              pl: 2, 
                              mb: 3,
                              color: subscription.textColor ? `${subscription.textColor}CC` : 'rgba(255,255,255,0.9)',
                              fontSize: { xs: '1.2rem', sm: '1rem' }
                            }}>
                              {subscription.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </Box>
                          </Box>
                        </PlanCard>
                      </motion.div>
                    </Grid2>
                  ))}
                </Grid2>
              </>
            )}
          </Container>
        </Section>
      ))}

      {error && (
        <Typography variant="h6" color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      <InstagramFeed />
    </BlogContainer>
  );
};

const BlogContainer = styled('div')({
  minHeight: '100vh'
});

const Section = styled(Box)({
  padding: '4rem 0'
});

const SectionTitle = styled(Typography)({
  textAlign: 'center',
  marginBottom: '3rem',

});

const PlanCard = styled(Card)({
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 3,
  bgcolor: 'black',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export default Blog;
