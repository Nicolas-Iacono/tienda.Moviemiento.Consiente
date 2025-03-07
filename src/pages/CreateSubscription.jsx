import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Stack } from '@mui/material';
import API from '@/utils/api';

const CreateSubscription = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    items: [],
    seccionId: ''
  });
  const [newItem, setNewItem] = useState('');
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Cargar las secciones disponibles
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

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData({
        ...formData,
        items: [...formData.items, newItem.trim()]
      });
      setNewItem('');
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('blog/suscripciones', formData);
      router.push('/editBlog');
    } catch (error) {
      console.error('Error al crear la suscripción:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crear Nueva Suscripción
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

          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Agregar Item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              margin="normal"
            />
            <Button
              variant="outlined"
              onClick={handleAddItem}
              sx={{ mt: 1 }}
            >
              Agregar Item
            </Button>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {formData.items.map((item, index) => (
              <Chip
                key={index}
                label={item}
                onDelete={() => handleRemoveItem(index)}
                sx={{ mt: 1 }}
              />
            ))}
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Crear Suscripción
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateSubscription;
