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
  Container,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { format } from 'date-fns';
import API from '@/utils/api';

// Row component for expandable details
const Row = ({ row, isMobile }) => {
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

  if (isMobile) {
    return (
      <Card sx={{ mb: 2, backgroundColor: 'background.paper', borderRadius:4}}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" component="div">
              Orden #{row.id}
            </Typography>
            <Chip
              label={row.paymentStatus}
              color={getStatusColor(row.paymentStatus)}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Fecha: {format(new Date(row.purchaseDate), 'dd/MM/yyyy HH:mm')}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total: ${row.totalAmount}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Email: {row.buyerInfo?.email || 'N/A'}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <IconButton
              size="small"
              onClick={() => setOpen(!open)}
              sx={{ mb: 1 }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              <Typography variant="body2" sx={{ ml: 1 }}>
                {open ? 'Ocultar detalles' : 'Ver detalles'}
              </Typography>
            </IconButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Productos
                </Typography>
                {row.orderDetails.map((detail) => (
                  <Box key={detail.id} sx={{ mb: 1, pl: 2 }}>
                    <Typography variant="body2">
                      {detail.product.nombre} x {detail.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Precio: ${detail.unitPrice} | Subtotal: ${detail.subtotal}
                    </Typography>
                  </Box>
                ))}

                {row.buyerInfo && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Información de envío
                    </Typography>
                    <Typography variant="body2">
                      Dirección: {row.shippingAddress}
                    </Typography>
                    <Typography variant="body2">
                      CP: {row.shippingZipCode}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Box>
        </CardContent>
      </Card>
    );
  }

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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4,
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Historial de Ventas
      </Typography>

      {isMobile ? (
        <Box sx={{ px: 1 }}>
          {ventas.map((venta) => (
            <Row key={venta.id} row={venta} isMobile={true} />
          ))}
        </Box>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 2
          }}
        >
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
                <Row key={venta.id} row={venta} isMobile={false} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Ventas;