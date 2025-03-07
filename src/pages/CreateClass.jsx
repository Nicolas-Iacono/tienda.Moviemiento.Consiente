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
  Stack
} from '@mui/material';
import { useRouter } from 'next/router';
import API from '@/utils/api';

const CreateClass = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    instructor: '',
    dias: [],
    horaInicio: '',
    horaFin: '',
    imagen: '',
    seccionId:''
  });
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/blog/clases', formData);
      router.push('/editBlog');
    } catch (error) {
      console.error('Error al crear la clase:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crear Nueva Clase
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre de la Clase"
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
          <TextField
            fullWidth
            label="Instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
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
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
            />
            <TextField
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
            />
          </Box>
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
          <TextField
            fullWidth
            label="URL de la Imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Crear Clase
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateClass;
