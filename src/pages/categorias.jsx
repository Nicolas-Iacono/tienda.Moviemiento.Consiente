import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Typography,
} from '@mui/material';
import API from '@/utils/api';

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await API.get('/category/all');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setError('Error al cargar las categorías');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewCategory('');
    setError('');
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError('El nombre de la categoría no puede estar vacío');
      return;
    }

    try {
      await API.post('/category/crear-category', {
        name: newCategory,
      });
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error('Error al crear categoría:', error);
      setError('Error al crear la categoría');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, marginTop:"5rem"} }>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Categorías
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ mb: 3 }}
      >
        Agregar Nueva Categoría
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad de Productos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.products?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Nueva Categoría</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la categoría"
            type="text"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddCategory} color="primary" variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Categorias;
