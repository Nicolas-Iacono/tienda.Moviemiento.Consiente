import { Grid2 } from '@mui/material'
import React, { useState, useEffect} from 'react'
import API from '@/utils/api'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import anime from 'animejs';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const Listado = () => {
    const[productos, setProductos] = useState([])




    useEffect(() => {
      const fetchProductos = async () => {
        try {
          const response = await API.get('/products/all'); // Asegúrate de que la ruta sea correcta
          setProductos(response.data); // Asigna los datos al estado
        } catch (error) {
          console.error('Error al obtener los productos:', error);
        }
      };
  
      fetchProductos();
    }, []); // El array vacío hace que se ejecute solo una vez
  

    console.log('------------------------------------');
    console.log(productos);

 // Función para eliminar un producto
 const handleEliminar = async (id) => {
  try {
    // Animación antes de eliminar
    anime({
      targets: `#fila-${id}`,
      opacity: 0,
      translateX: -100,
      backgroundColor: 'rgb(255, 153, 0)',
      duration: 1000,
      easing: 'easeInOutQuad',
      complete: async () => {
        // Llamar a la API para eliminar el producto
        await API.delete(`/products/producto/${id}`);
        // Filtrar el estado después de la animación
        setProductos((prev) => prev.filter((producto) => producto.id !== id));
      },
    });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
};

// Función para editar un producto (por ahora solo imprime el ID)
const handleEditar = (id) => {
  console.log(`Editar producto con ID: ${id}`);
};

return (
  <TableContainer component={Paper} sx={{marginBottom:{xs:"3rem",md:"0px"}}}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{width:{xs:"1rem"}}}>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Precio Lista</TableCell>
          <TableCell>Precio</TableCell>
          <TableCell>Stock</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {productos.map((producto) => (
          <TableRow key={producto.id}  id={`fila-${producto.id}`}>
            <TableCell sx={{width:{xs:"1rem"}}}>{producto.id}</TableCell>
            <TableCell>{producto.name}</TableCell>
            <TableCell>${producto.priceLista}</TableCell>
            <TableCell>${producto.price}</TableCell>
            <TableCell>{producto.stock}</TableCell>
            <TableCell>
              <Button variant="contained" color="primary" onClick={() => handleEditar(producto.id)} style={{ marginRight: 5 }}>
                <ModeEditIcon/>
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleEliminar(producto.id)}>
                <DeleteIcon/>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
}

export default Listado