import React, { useEffect, useState } from 'react';
import API from '@/utils/api';
import { Box, Radio, FormControlLabel, RadioGroup, FormControl, FormLabel } from '@mui/material';

const ListaCategorias = ({ onCategorySelected }) => {
    const [productos, setProductos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Calcula categoriasUnicas DENTRO del componente
    const categoriasUnicas = Object.values(productos.reduce((acumulador, producto) => {
        if (producto.categoriaId && !acumulador[producto.categoriaId]) {
            acumulador[producto.categoriaId] = {
                id: producto.categoriaId,
                nombre: producto.categoriaName
            };
        }
        return acumulador;
    }, {}));
 
    useEffect(() => {
        const fetchProductos = async () => { 
            try {
                const response = await API.get('/products/all');
                setProductos(response.data);
            } catch (err) {
                console.error('Error al obtener los productos:', err);
                setError('Error al cargar los productos. Por favor, inténtelo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const handleFilterChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        onCategorySelected(categoryId); 
    };

    const handleAllCategories = () => {
        setSelectedCategory(null); 
        onCategorySelected(null); 
    }

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Box sx={{ color: "black" }}>
            <FormControl>
                <FormLabel id="categorias-radio-buttons-group-label">Categorías</FormLabel>
                <RadioGroup
                    aria-labelledby="categorias-radio-buttons-group-label"
                    name="categorias-radio-buttons-group"
                    value={selectedCategory}
                    onChange={handleFilterChange}
                >

                    {categoriasUnicas.map((cat) => (
                        <FormControlLabel
                            key={cat.id}
                            value={cat.id}
                            control={<Radio />}
                            label={cat.nombre}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default ListaCategorias;