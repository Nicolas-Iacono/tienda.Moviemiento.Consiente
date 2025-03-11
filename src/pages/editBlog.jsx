import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Grid2, IconButton, Collapse, CardActions, Chip, ImageList, ImageListItem } from '@mui/material';
import { useMyUserContext } from '../context/userContext';
import { useRouter } from 'next/router';
import API from '@/utils/api';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import ImageUploader from '@/components/ImageUploader';

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
  const { isAdmin, user } = useMyUserContext();
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
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
      // Fetch sections again after deletion
      const response = await API.get('/blog/secciones');
      if (response?.data) {
        setSections(response.data);
      }
    } catch (error) {
      console.error('Error al eliminar sección:', error);
      setError('Error al eliminar la sección');
    }
  };

  const handleDeleteClase = async (id) => {
    try {
      await API.delete(`/blog/clases/${id}`);
      // Refresh the sections data to get updated classes
      const response = await API.get('/blog/secciones');
      if (response?.data) {
        setSections(response.data);
      }
    } catch (error) {
      console.error('Error al eliminar clase:', error);
      setError('Error al eliminar la clase');
    }
  };

  const handleSliderImagesUpload = async (urls) => {
    if (urls && urls.length > 0) {
      try {
        await API.post(`/galery/users/${user.id}/galery/images`, {
          images: urls
        });
        setSliderImages(prevImages => [...prevImages, ...urls]);
      } catch (error) {
        console.error('Error al guardar imágenes:', error);
        setError('Error al guardar las imágenes');
      }
    }
  };

  const handleDeleteSliderImage = async (imageUrl) => {
    try {
      await API.delete(`/galery/users/${user.id}/galery/images`, {
        data: { imageUrl }
      });
      setSliderImages(prevImages => prevImages.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      setError('Error al eliminar la imagen');
    }
  };

  useEffect(() => {
    const fetchSliderImages = async () => {
      if (!user?.id) return;

      try {
        const response = await API.get(`/galery/users/${user.id}/galery`);
        if (response?.data?.images) {
          setSliderImages(response.data.images);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Si la galería no existe, la creamos
          try {
            await API.post(`/galery/users/${user.id}/galery`, {
              images: [],
              profileImage: null
            });
            setSliderImages([]);
          } catch (createError) {
            console.error('Error al crear galería:', createError);
            setError('Error al crear la galería');
          }
        } else {
          console.error('Error al obtener imágenes:', error);
          setError('Error al obtener las imágenes');
        }
      }
    };

    fetchSliderImages();
  }, [user?.id]);

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
  }, []);

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
        setError(null);
        // Fetch sections again after adding new one
        const sectionsResponse = await API.get('/blog/secciones');
        if (sectionsResponse?.data) {
          setSections(sectionsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error al crear sección:', error);
      setError('Error al crear la sección');
    }
  };

  // Redirigir si no es admin
  useEffect(() => {
    if (!isAdmin()) {
      router.push('/blog');
    }
  }, [isAdmin, router]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editor de Blog
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Sección de imágenes del slider */}
      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Imágenes del Slider
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona las fotos que aparecerán al principio de tu página. Se recomienda usar imágenes horizontales.
            </Typography>
            
            <ImageUploader onUploadComplete={handleSliderImagesUpload} />

            {sliderImages.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Imágenes actuales:
                </Typography>
                <ImageList sx={{ width: '100%', height: 200 }} cols={4} rowHeight={164}>
                  {sliderImages.map((img, index) => (
                    <ImageListItem key={index} sx={{ position: 'relative' }}>
                      <img
                        src={img}
                        alt={`Slider image ${index + 1}`}
                        loading="lazy"
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        onClick={() => handleDeleteSliderImage(img)}
                      >
                        <DeleteIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

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

      <Grid2 container spacing={3}>
        {sections.map((section) => (
          <Grid2 item xs={12} key={section.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{section.titulo}</Typography>
                  <Box>
                    <IconButton
                      onClick={() => router.push('/CreateClass')}
                      title="Agregar Publicacion"
                      sx={{ color:"black" }}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteSection(section.id)}
                      color="error"
                      title="Eliminar Sección"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <ExpandMore
                      expand={expandedId === section.id}
                      onClick={() => handleExpandClick(section.id)}
                      aria-expanded={expandedId === section.id}
                      aria-label="mostrar más"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </Box>
                </Box>
                <Typography variant="subtitle1" color="text.secondary">
                  {section.descripcion}
                </Typography>
                <Collapse in={expandedId === section.id} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Clases
                    </Typography>
                    {Array.isArray(section.clases) && section.clases.length > 0 ? (
                      section.clases.map((clase) => (
                        <Box key={clase.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                          <Typography variant="subtitle1">{clase.nombre}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {clase.descripcion}
                          </Typography>
                          {/* <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={`Instructor: ${clase.instructor}`} 
                              size="small" 
                              sx={{ mr: 1, mb: 1 }} 
                            />
                            <Chip 
                              label={`Horario: ${clase.horaInicio} - ${clase.horaFin}`} 
                              size="small" 
                              sx={{ mr: 1, mb: 1 }} 
                            />
                            {clase.dias.map((dia, index) => (
                              <Chip 
                                key={index} 
                                label={dia} 
                                size="small" 
                                sx={{ mr: 1, mb: 1 }} 
                              />
                            ))}
                          </Box> */}
                          <Box sx={{ mt: 1 }}>
                            <IconButton
                              onClick={() => handleDeleteClase(clase.id)}
                              color="error"
                              title="Eliminar Clase"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography color="text.secondary">No hay clases en esta sección</Typography>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default EditBlog;
