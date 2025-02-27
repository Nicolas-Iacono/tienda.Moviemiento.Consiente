import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Grid2, IconButton, Collapse, CardActions } from '@mui/material';
import { useMyUserContext } from '../context/userContext';
import { useRouter } from 'next/router';
import API from '@/utils/api';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const EditBlog = () => {
  const { isAdmin } = useMyUserContext();
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [newSection, setNewSection] = useState({
    nombre: '',
    titulo: '',
    descripcion: '',
  });

  // Redirigir si no es admin
  useEffect(() => {
    if (!isAdmin()) {
      router.push('/blog');
    }
  }, [isAdmin, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpandClick = (sectionId) => {
    setExpandedId(expandedId === sectionId ? null : sectionId);
  };

  const handleDeleteSection = async (id) => {
   
      try {
        await API.delete(`/blog/secciones/${id}`);
        fetchSections(); // Recargar las secciones después de eliminar
      } catch (error) {
        console.error('Error al eliminar sección:', error);
        setError('Error al eliminar la sección');
      }
    
  };

useEffect(() => {
  const fetchSections = async () => {
    try {
      const response = await API.get('/blog/secciones');
      if (response?.data) {
        setSections(response.data);
      }
    } catch (error) {
      console.error('Error al obtener secciones:', error);
      setError('Error al cargar las secciones');
    }
  };


  fetchSections();



},[])
  

  console.log(sections)


  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSection.nombre.trim()) {
      setError('El nombre de la sección no puede estar vacío');
      return;
    }

    try {
      const response = await API.post('/blog/secciones', {
        ...newSection,
        activo: true
      });
      
      if (response?.data) {
        setNewSection({ nombre: '', titulo: '', descripcion: '' });
        fetchSections();
        setError(null);
      }
    } catch (error) {
      console.error('Error al crear sección:', error);
      setError('Error al crear la sección');
    }
  };

  

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Editor de Blog
      </Typography>

      <Box component="form" onSubmit={handleAddSection} sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Crear Nueva Sección
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={newSection.nombre}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Título"
                  name="titulo"
                  value={newSection.titulo}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={newSection.descripcion}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid2>
              <Grid2 item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Crear Sección
                </Button>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h5" gutterBottom>
        Secciones Existentes
      </Typography>
      <Grid2 container spacing={2}>
        {sections.map((section) => (
          <Grid2 item xs={12} md={6} key={section.id} sx={{width:"100%", display:"flex", flexDirection:"column"}}>
            <Card sx={{width:"100%"}}>
              <CardContent sx={{ position: 'relative', pb: 0 }}>
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteSection(section.id)}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <ExpandMore
                    expand={expandedId === section.id}
                    onClick={() => handleExpandClick(section.id)}
                    aria-expanded={expandedId === section.id}
                    aria-label="mostrar más"
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' }
                    }}
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ pr: 8 }}>
                  {section.titulo}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {section.descripcion}
                </Typography>
              </CardContent>
              <Collapse in={expandedId === section.id} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Nombre: {section.nombre}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Clases ({section.clases?.length || 0}):
                  </Typography>
                  {section.clases?.map((clase) => (
                    <Box key={clase.id} sx={{ ml: 2, mb: 1 }}>
                      <Typography variant="body2">
                        • {clase.nombre} - {clase.instructor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {clase.dias.join(', ')} | {clase.horaInicio} - {clase.horaFin}
                      </Typography>
                    </Box>
                  ))}
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Suscripciones ({section.suscripciones?.length || 0}):
                  </Typography>
                  {section.suscripciones?.map((sub) => (
                    <Box key={sub.id} sx={{ ml: 2, mb: 1 }}>
                      <Typography variant="body2">
                        • {sub.nombre} - ${sub.precio}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sub.descripcion}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Collapse>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default EditBlog;
