import React from 'react';
import { styled } from '@mui/material/styles';
import HeroSlider from '../components/HeroSlider';
import InstagramFeed from '../components/InstagramFeed';
import ClassSchedule from '../components/ClassSchedule';
import { Container, Grid2, Button, Card, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Blog = () => {
  const nutritionPlans = [
    {
      title: 'Plan Básico',
      description: 'Plan personalizado de nutrición con seguimiento mensual',
      price: '$29.99/mes',
      features: ['Evaluación inicial', 'Plan alimenticio personalizado', 'Una consulta mensual']
    },
    {
      title: 'Plan Premium',
      description: 'Plan completo con seguimiento semanal y ajustes continuos',
      price: '$49.99/mes',
      features: ['Todo lo del plan básico', 'Consultas semanales', 'Ajustes de plan según progreso', 'Recetas exclusivas']
    }
  ];

  return (
    <BlogContainer>
      <HeroSlider />
      
      <Section>
        <Container>
          <SectionTitle sx={{ color: 'white' }} variant="h2">Bienvenidos a Movimiento Consiente</SectionTitle>
          <Typography sx={{ color: '#C3DE5A' }} variant="h6" component="p" align="center" gutterBottom>
            Descubre un nuevo nivel de bienestar físico y mental
          </Typography>
        </Container>
      </Section>

      <ClassSchedule />

      <Section sx={{ backgroundColor: '#f8f8f8' }}>
        <Container>
          <SectionTitle variant="h2">Planes de Nutrición</SectionTitle>
          <Grid2 container spacing={4} justifyContent="center">
            {nutritionPlans.map((plan, index) => (
              <Grid2 item xs={12} md={6} key={index}>
                <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                  <PlanCard>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {plan.title}
                      </Typography>
                      <Typography variant="h4" component="p" color="primary" gutterBottom>
                        {plan.price}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" paragraph>
                        {plan.description}
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {plan.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </Box>
                      <Button variant="contained" color="primary" fullWidth>
                        Comenzar Ahora
                      </Button>
                    </Box>
                  </PlanCard>
                </motion.div>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Section>

      <InstagramFeed />

      <Section>
        <Container>
          <SectionTitle variant="h2">Galería de Fotos</SectionTitle>
          <Grid2 container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid2 item xs={12} sm={6} md={4} key={item}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    component="img"
                    src={`https://placehold.co/600x400/png?text=Gallery+${item}`}
                    alt={`Gallery image ${item}`}
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                </motion.div>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Section>

      <Box sx={{ 
        backgroundColor: '#333',
        color: 'white',
        py: 4
      }}>
        <Container>
          <SectionTitle variant="h2" sx={{ color: 'white' }}>Contacto</SectionTitle>
          <Grid2 container spacing={4} justifyContent="center">
            <Grid2 item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Ubicación
                </Typography>
                <Typography paragraph>
                  Av. Ejemplo 123, Ciudad
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Teléfono
                </Typography>
                <Typography paragraph>
                  +123 456 789
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Email
                </Typography>
                <Typography paragraph>
                  info@movimientoconsiente.com
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
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
