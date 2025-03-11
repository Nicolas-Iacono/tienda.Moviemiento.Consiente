import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CardMedia,
} from '@mui/material';
import { useRouter } from 'next/router';
import API from '@/utils/api';
import ImageUploader from "@/components/ImageUploader";

const CreateClass = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    instructor: 'oferta',
    dias: ["lunes", "martes"],
    horaInicio: "18:00:00",
    horaFin: "19:00:00",
    imagen: [''],
    seccionId: '',
    productoId: null,
    cardBgColor: '#000000',
    cardTextColor: '#FFFFFF'
  });
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar las secciones disponibles
    const fetchSections = async () => {
      try {
        const response = await API.get('/blog/secciones');
        setSections(response.data);
      } catch (error) {
        console.error('Error al cargar las secciones:', error);
        setError('Error al cargar las secciones');
      }
    };

    // Cargar los productos disponibles
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products/all');
        console.log('Products loaded:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
        setError('Error al cargar los productos');
      }
    };

    fetchSections();
    fetchProducts();
  }, []);

  const diasSemana = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special handling for productoId
    if (name === 'productoId') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    console.log(`Field ${name} changed to:`, value, typeof value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        imagen: formData.imagen[0] || '',
        cardBgColor: formData.cardBgColor || '#000000',
        cardTextColor: formData.cardTextColor || '#FFFFFF'
      };
      console.log('Sending form data:', dataToSend);
      
      const response = await API.post('/blog/clases', dataToSend);
      console.log('Response:', response);
      
      if (response?.data) {
        console.log('Class created successfully:', response.data);
        router.push('/editBlog');
      } else {
        console.error('No response data received');
        alert('Error al crear la clase: No se recibió respuesta del servidor');
      }
    } catch (error) {
      console.error('Error details:', error);
      alert(`Error al crear la clase: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crear Nueva Publicidad
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre de la Publicidad"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            multiline
            rows={4}
            value={formData.descripcion}
            onChange={handleChange}
            margin="normal"
            required
          />
          {/* <TextField
            fullWidth
            label="Marca"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            margin="normal"
            required
          /> */}
          {/* <FormControl fullWidth margin="normal">
            <InputLabel>Días de la Semana</InputLabel>
            <Select
              multiple
              name="dias"
              value={formData.dias}
              onChange={handleChange}
              renderValue={(selected) => (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selected.map((value) => (
                    <Typography key={value} component="span" sx={{ mr: 1 }}>
                      {value}
                   </Typography>
                  ))}
                </Stack>
              )}
            >
              {diasSemana.map((dia) => (
                <MenuItem key={dia} value={dia}>
                  {dia}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Hora de Inicio"
              name="horaInicio"
              type="time"
              value={formData.horaInicio}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              required
            /> */}
            {/* <TextField
              fullWidth
              label="Hora de Fin"
              name="horaFin"
              type="time"
              value={formData.horaFin}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              required
            /> */}
          {/* </Box> */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Sección</InputLabel>
            <Select
              name="seccionId"
              value={formData.seccionId}
              onChange={handleChange}
              required
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl> 
          <FormControl fullWidth margin="normal">
            <InputLabel>Vincular a producto</InputLabel>
            <Select
              name="productoId"
              value={formData.productoId || ''}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Ninguno</em>
              </MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>     

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ color: "#67677D" }}>
              Personalización de Colores
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink htmlFor="cardBgColor">Color de Fondo</InputLabel>
                <TextField
                  id="cardBgColor"
                  name="cardBgColor"
                  type="color"
                  value={formData.cardBgColor}
                  onChange={handleChange}
                  sx={{ 
                    '& input': { 
                      padding: '10px',
                      height: '40px'
                    }
                  }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink htmlFor="cardTextColor">Color de Texto</InputLabel>
                <TextField
                  id="cardTextColor"
                  name="cardTextColor"
                  type="color"
                  value={formData.cardTextColor}
                  onChange={handleChange}
                  sx={{ 
                    '& input': { 
                      padding: '10px',
                      height: '40px'
                    }
                  }}
                />
              </FormControl>
            </Stack>
          </Box>

          <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: "#67677D" }}>
              Vista Previa de Colores
            </Typography>
            <Box sx={{ 
              p: 2, 
              borderRadius: 1,
              bgcolor: formData.cardBgColor,
              color: formData.cardTextColor
            }}>
              <Typography variant="h5">{formData.nombre || 'Título de la Publicidad'}</Typography>
              <Typography>{formData.descripcion || 'Descripción de la publicidad'}</Typography>
            </Box>
          </Box>
     
          <Box>
            <Typography variant="h6" sx={{ color: "#67677D" }}>
              Agregar imágenes de producto
            </Typography>
            <ImageUploader
              onUploadComplete={(urls) =>
                setFormData(prev => ({
                  ...prev,
                  imagen: urls
                }))
              }
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {formData.imagen.map((img, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  image={img}
                  alt={`Imagen ${index + 1}`}
                  sx={{ width: "100%", height: "auto", borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Publicar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateClass;
