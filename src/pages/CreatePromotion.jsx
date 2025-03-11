import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import API from '@/utils/api';

const CreatePromotion = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    descuento: '',
    fechaInicio: '',
    fechaFin: '',
    seccionId: ''
  });
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await API.get('blog/secciones');
        setSections(response.data);
      } catch (error) {
        console.error('Error al cargar las secciones:', error);
      }
    };
    fetchSections();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('blog/promociones', formData);
      router.push('/editBlog');
    } catch (error) {
      console.error('Error al crear la promoción:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crear Nueva Promoción
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Precio"
            name="precio"
            type="number"
            value={formData.precio}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descuento (%)"
            name="descuento"
            type="number"
            value={formData.descuento}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Fecha de Inicio"
            name="fechaInicio"
            type="date"
            value={formData.fechaInicio}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Fecha de Fin"
            name="fechaFin"
            type="date"
            value={formData.fechaFin}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
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

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Crear Promoción
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePromotion;
