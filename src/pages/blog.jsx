import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import HeroSlider from '../components/HeroSlider';
import InstagramFeed from '../components/InstagramFeed';
import ClassSchedule from '../components/ClassSchedule';
import { Container, Grid2, Button, Card, Typography, Box, IconButton, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import { useMyUserContext } from '../context/userContext';
import API from '@/utils/api';

const Blog = () => {
  const { user } = useMyUserContext();
  const router = useRouter();
  const [sections, setSections] = useState([]);


  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await API.get('/blog/secciones');
        const sectionsData = response.data;
        
        // Filter sections that have classes or subscriptions
        const sectionsWithContent = sectionsData.filter(section => 
          (section.clases && section.clases.length > 0) || 
          (section.suscripciones && section.suscripciones.length > 0)
        );
        
        setSections(sectionsWithContent);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };
    fetchSections();
  }, []);

  console.log("ES ADMIN" ,user.authorities)
  return (
    <BlogContainer>
      {user.authorities.includes('ROLE_ADMIN') && (
        <Box sx={{ position: 'fixed', top: 70, right: 20, zIndex: 1000 }}>
          <IconButton
            color="primary"
            sx={{ 
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            onClick={() => router.push('/editBlog')}
          >
            <EditIcon />
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
        <Section key={section.id} sx={{ backgroundColor: section.clases?.length > 0 ? '#f8f8f8' : 'white' }}>
          <Container>
            <SectionTitle variant="h2">{section.nombre}</SectionTitle>
            
            {section.clases && section.clases.length > 0 && (
              <>
                <Grid2 container spacing={4} justifyContent="center">
                  {section.clases.map((clase) => (
                    <Grid2 item xs={12} md={6} key={clase.id}>
                      <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                        <PlanCard>
                          <Box>
                            <img src={clase.imagen} alt={clase.nombre} style={{ width: '100%', height: 'auto' }} />
                          </Box>
                          <Box sx={{ p: 3 }}>
                            <Typography variant="h5" component="h3" gutterBottom>
                              {clase.nombre}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              {clase.descripcion}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Instructor: {clase.instructor}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Horario: {clase.horaInicio} - {clase.horaFin}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              {clase.dias.map((dia, idx) => (
                                <Chip key={idx} label={dia} sx={{ mr: 1, mb: 1 }} />
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

            {section.suscripciones && section.suscripciones.length > 0 && (
              <>
                <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Suscripciones</Typography>
                <Grid2 container spacing={4} justifyContent="center">
                  {section.suscripciones.map((subscription) => (
                    <Grid2 item xs={12} md={6} key={subscription.id}>
                      <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                        <PlanCard>
                          <Box sx={{ p: 3 }}>
                            <Typography variant="h5" component="h3" gutterBottom>
                              {subscription.nombre}
                            </Typography>
                            <Typography variant="h4" component="p" color="primary" gutterBottom>
                              ${subscription.precio}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              {subscription.descripcion}
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                              {subscription.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </Box>
                            <Button variant="contained" color="primary" fullWidth>
                              Suscribirse
                            </Button>
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
  height: '100%',
});

export default Blog;
