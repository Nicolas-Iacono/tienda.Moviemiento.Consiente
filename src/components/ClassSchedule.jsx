import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Grid, Box, Typography, List, ListItem } from '@mui/material';
import { motion } from 'framer-motion';

const classes = [
  {
    name: 'Yoga',
    description: 'Encuentra tu equilibrio interior',
    schedule: ['Lunes y Miércoles 8:00 AM', 'Martes y Jueves 6:00 PM'],
    instructor: 'Ana María',
    image: 'https://placehold.co/600x400/png?text=Yoga'
  },
  {
    name: 'Pilates',
    description: 'Fortalece tu core y mejora tu postura',
    schedule: ['Martes y Jueves 9:00 AM', 'Lunes y Miércoles 7:00 PM'],
    instructor: 'Carlos',
    image: 'https://placehold.co/600x400/png?text=Pilates'
  },
  // Añade más clases según necesites
];

const ClassSchedule = () => {
  return (
    <Section>
      <SectionTitle variant="h2">Nuestras Clases</SectionTitle>
      <Grid container spacing={4}>
        {classes.map((classItem, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ClassCard elevation={3}>
                <ClassImage component="img" src={classItem.image} alt={classItem.name} />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {classItem.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {classItem.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                    Instructor: {classItem.instructor}
                  </Typography>
                  <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                    {classItem.schedule.map((time, idx) => (
                      <ListItem key={idx} sx={{ bgcolor: 'grey.100', mb: 1, borderRadius: 1 }}>
                        <Typography variant="body2">
                          {time}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </ClassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};

const Section = styled(Box)({
  padding: '4rem 2rem',
  backgroundColor: 'white',
});

const SectionTitle = styled(Typography)({
  textAlign: 'center',
  marginBottom: '3rem',
  color: '#333',
});

const ClassCard = styled(Paper)({
  overflow: 'hidden',
  height: '100%',
});

const ClassImage = styled(Box)({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
});

export default ClassSchedule;
