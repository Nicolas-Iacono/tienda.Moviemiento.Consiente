import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  TextareaAutosize,
  IconButton,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import SelectAPI from "./selectCategoria";
import SwitchDisponibility from "./buttons/SwitchDisponibility";
import API from "@/utils/api";
import ImageUploader from "./ImageUploader";
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';

const validationSchema = Yup.object({
  nombre: Yup.string(),
  marca: Yup.string(),
  stock: Yup.number()
    .min(0, "El stock debe ser mayor o igual a 0"),
  precioLista: Yup.number()
    .min(0, "El precio debe ser mayor o igual a 0"),
  precioVenta: Yup.number()
    .min(0, "El precio debe ser mayor o igual a 0"),
  descripcion: Yup.string(),
  imagenes: Yup.array()
    .of(Yup.string().url("Debe ser una URL válida"))
    .min(1, "Debe agregar al menos una imagen"),
  categoriaId: Yup.number(),
  disponible: Yup.boolean(),
  alto: Yup.number()
    .max(150, "El alto maximo permitido es de 150 cm"),
  ancho: Yup.number()
    .max(150, "El ancho maximo permitido es de 150 cm"),
  largo: Yup.number()
    .max(150, "El largo maximo permitido es de 150 cm"),
  peso: Yup.number()
    
    .max(25000, "El peso maximo permitido es de 25.000 gramos"),
});

const ProductoUpdateForm = ({ productId }) => {
  const [view, setView] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      if (!productId) return;
      
      try {
        console.log('Fetching product with ID:', productId);
        const response = await API.get(`/products/producto/${productId}`);
        const producto = response.data;
        console.log('Product data received:', producto);
        
        setFormData({
          nombre: producto.nombre || "",
          marca: producto.marca || "",
          stock: producto.stock || 0,
          precioLista: producto.precioLista || 0,
          precioVenta: producto.precioVenta || 0,
          descripcion: producto.descripcion || "",
          categoriaId: producto.categoriaId || null,
          imagenes: producto.imagenes || [""],
          disponible: producto.disponible ?? true,
          alto: producto.alto || 0,
          ancho: producto.ancho || 0,
          largo: producto.largo || 0,
          peso: producto.peso || 0,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        alert("Error al cargar los datos del producto");
        router.push('/listado');
      }
    };

    fetchProducto();
  }, [productId]);
  

  const formik = useFormik({
    initialValues: formData || {
      nombre: "",
      marca: "",
      stock: 0,
      precioLista: 0,
      precioVenta: 0,
      descripcion: "",
      categoriaName: "",
      categoriaId: null,
      imagenes: [""],
      disponible: true,
      alto: 0,
      ancho: 0,
      largo: 0,
      peso: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await API.put(`/products/producto/${productId}`, {
          nombre: values.nombre,
          marca: values.marca,
          stock: values.stock,
          precioLista: values.precioLista,
          precioVenta: values.precioVenta,
          descripcion: values.descripcion,
          categoriaId: values.categoriaId,
          images: values.imagenes,
          disponible: values.disponible,
          alto: values.alto,
          ancho: values.ancho,
          largo: values.largo,
          peso: values.peso,
        });
        console.log("Producto actualizado exitosamente:", response.data);
        alert("Producto actualizado exitosamente");
        router.push('/listado');
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        alert("Hubo un error al actualizar el producto");
      } finally {
        setLoading(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (formData) {
      console.log('Setting form values:', formData);
      formik.setValues(formData);
    }
  }, [formData]);

  const handleCategorySelect = (categoryId) => {
    formik.setFieldValue("categoriaId", categoryId);
  };

  const handleSubmit = async (values) => {
    await formik.submitForm();
  };

  const handleAddImageField = () => {
    formik.setFieldValue("imagenes", [...formik.values.imagenes, ""]);
  };

  const handleRemoveImageField = (index) => {
    const newImages = formik.values.imagenes.filter((_, i) => i !== index);
    formik.setFieldValue("imagenes", newImages);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100%'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        padding: 2,
        height: "90%",
        justifyContent: "flex-start",
        position: "relative",
        marginTop: formik.values?.imagenes?.length > 0 ? "2rem" : "0",
        transition: "margin-top 0.3s ease",
        marginBottom: { xs: "4rem", md: "0px" },
      }}
    >
      <Typography variant="h4" sx={{ color: "black" }}>
        Actualizar Producto
      </Typography>
      <Box
        sx={{
          marginTop: formik.values?.imagenes?.length > 0 ? "1rem" : "0",
          transition: "margin-top 0.3s ease",
          width: "100%",
          border: { xs: "none", md: "1px solid black" },
          borderRadius: "10px",
          padding: { xs: 0, md: 2 },
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column" }, gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
              <TextField
                label="Marca"
                name="marca"
                value={formik.values.marca}
                onChange={formik.handleChange}
                error={formik.touched.marca && Boolean(formik.errors.marca)}
                helperText={formik.touched.marca && formik.errors.marca}
              />
            </Box>
            <Box sx={{
              display: "flex",
              gap: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0rem 1.5rem"
            }}>
              <Typography variant="h5" color="black">
                Stock / PrecioLista / PrecioVenta
              </Typography>
            </Box>
            <Box sx={{
              display: "flex",
              gap: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "1rem"
            }}>
              <TextField
                type="number"
                label="Stock"
                name="stock"
                value={formik.values.stock}
                onChange={formik.handleChange}
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
              />
              <TextField
                type="number"
                label="Precio de Lista"
                name="precioLista"
                value={formik.values.precioLista}
                onChange={formik.handleChange}
                error={formik.touched.precioLista && Boolean(formik.errors.precioLista)}
                helperText={formik.touched.precioLista && formik.errors.precioLista}
              />
              <TextField
                type="number"
                label="Precio de Venta"
                name="precioVenta"
                value={formik.values.precioVenta}
                onChange={formik.handleChange}
                error={formik.touched.precioVenta && Boolean(formik.errors.precioVenta)}
                helperText={formik.touched.precioVenta && formik.errors.precioVenta}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextareaAutosize
                minRows={3}
                placeholder="Descripción"
                name="descripcion"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: formik.errors.descripcion ? "20px" : "0",
                }}
              />
              {formik.touched.descripcion && formik.errors.descripcion && (
                <Typography color="error" variant="caption">
                  {formik.errors.descripcion}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <SelectAPI
                onCategorySelect={handleCategorySelect}
                initialCategoryId={formik.values.categoriaId}
              />
              {formik.touched.categoriaId && formik.errors.categoriaId && (
                <Typography color="error" variant="caption">
                  {formik.errors.categoriaId}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>Disponible:</Typography>
              <SwitchDisponibility
                checked={formik.values.disponible}
                onChange={(e) =>
                  formik.setFieldValue("disponible", e.target.checked)
                }
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" color="black">
                Dimensiones y Peso
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  type="number"
                  label="Alto (cm)"
                  name="alto"
                  value={formik.values.alto}
                  onChange={formik.handleChange}
                  error={formik.touched.alto && Boolean(formik.errors.alto)}
                  helperText={formik.touched.alto && formik.errors.alto}
                />
                <TextField
                  type="number"
                  label="Ancho (cm)"
                  name="ancho"
                  value={formik.values.ancho}
                  onChange={formik.handleChange}
                  error={formik.touched.ancho && Boolean(formik.errors.ancho)}
                  helperText={formik.touched.ancho && formik.errors.ancho}
                />
                <TextField
                  type="number"
                  label="Largo (cm)"
                  name="largo"
                  value={formik.values.largo}
                  onChange={formik.handleChange}
                  error={formik.touched.largo && Boolean(formik.errors.largo)}
                  helperText={formik.touched.largo && formik.errors.largo}
                />
                <TextField
                  type="number"
                  label="Peso (g)"
                  name="peso"
                  value={formik.values.peso}
                  onChange={formik.handleChange}
                  error={formik.touched.peso && Boolean(formik.errors.peso)}
                  helperText={formik.touched.peso && formik.errors.peso}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" color="black">
                Imágenes
              </Typography>
              {formik.values.imagenes.map((url, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    fullWidth
                    label={`URL de imagen ${index + 1}`}
                    value={url}
                    onChange={(e) => {
                      const newImages = [...formik.values.imagenes];
                      newImages[index] = e.target.value;
                      formik.setFieldValue("imagenes", newImages);
                    }}
                    error={
                      formik.touched.imagenes &&
                      formik.errors.imagenes &&
                      formik.errors.imagenes[index]
                    }
                    helperText={
                      formik.touched.imagenes &&
                      formik.errors.imagenes &&
                      formik.errors.imagenes[index]
                    }
                  />
                  {index > 0 && (
                    <IconButton
                      onClick={() => handleRemoveImageField(index)}
                      color="error"
                    >
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddImageField}
                sx={{ alignSelf: "flex-start" }}
              >
                Agregar otra imagen
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Actualizar Producto
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ProductoUpdateForm;
