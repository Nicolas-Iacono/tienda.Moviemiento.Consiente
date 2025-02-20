import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { format } from 'date-fns';
import  API  from '@/utils/api';


// Row component for expandable details
const Row = ({ row }) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell>
          <Chip 
            label={row.paymentStatus} 
            color={getStatusColor(row.paymentStatus)}
            size="small"
          />
        </TableCell>
        <TableCell>${row.totalAmount}</TableCell>
        <TableCell>
          {format(new Date(row.purchaseDate), 'dd/MM/yyyy HH:mm')}
        </TableCell>
        <TableCell>{row.buyerInfo?.email || 'N/A'}</TableCell>
        <TableCell>{row.shippingAddress}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles del Pedido
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>{detail.product.nombre}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>${detail.unitPrice}</TableCell>
                      <TableCell>${detail.subtotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {row.buyerInfo && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información del Comprador
                  </Typography>
                  <Typography variant="body2">
                    Email: {row.buyerInfo.email}
                    {row.buyerInfo.identification && (
                      <>
                        <br />
                        {row.buyerInfo.identification.type}: {row.buyerInfo.identification.number}
                      </>
                    )}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const { data } = await API.get('/orders/all');
        setVentas(data);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    fetchVentas();
  }, []);

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Historial de Ventas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha de Compra</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Dirección de Envío</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((venta) => (
              <Row key={venta.id} row={venta} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ventas;