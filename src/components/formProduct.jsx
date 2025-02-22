import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CardMedia,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import SelectAPI from "./selectCategoria";
import SwitchDisponibility from "./buttons/SwitchDisponibility";
import API from "@/utils/api";
import ImageUploader from "./ImageUploader";

const validationSchema = Yup.object({
  nombre: Yup.string().required("El nombre es obligatorio"),
  marca: Yup.string().required("La marca es obligatoria"),
  stock: Yup.number()
    .required("El stock es obligatorio")
    .min(0, "El stock debe ser mayor o igual a 0"),
  precioLista: Yup.number()
    .required("El precio de lista es obligatorio")
    .min(0, "El precio debe ser mayor o igual a 0"),
  precioVenta: Yup.number()
    .required("El precio de venta es obligatorio")
    .min(0, "El precio debe ser mayor o igual a 0"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
  imagenes: Yup.array()
    .of(Yup.string().url("Debe ser una URL válida"))
    .min(1, "Debe agregar al menos una imagen"),
  categoriaId: Yup.number().required("La categoría es obligatoria"),
  disponible: Yup.boolean().required("La disponibilidad es obligatoria"),
  alto: Yup.number()
    .required("la altura es necesaria para calcular el envio")
    .max(150, "El alto maximo permitido es de 150 cm"),
  ancho: Yup.number()
    .required("El ancho es necesario para calcular el envio")
    .max(150, "El ancho maximo permitido es de 150 cm"),
  largo: Yup.number()
    .required("El largo es necesario para calcular el envio")
    .max(150, "El largo maximo permitido es de 150 cm"),
  peso: Yup.number()
    .required("El peso es necesario para calcular el envio")
    .min(1, "El peso minimo permitido es de 1 gramo")
    .max(25000, "El peso maximo permitido es de 25.000 gramos"),
});

const textFieldStyles = {
  backgroundColor: "#24242F",
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#333340",
    },
    "&:hover fieldset": {
      borderColor: "#363645",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#363645",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#363645",
  },
};

const textareaStyles = {
  width: "100%",
  borderRadius: "4px",
  padding: "10px",
  backgroundColor: "#24242F",
  color: "white",
  border: "1px solid #333340",
  fontFamily: "inherit",
  fontSize: "1rem",
  "&:hover": {
    borderColor: "#363645",
  },
  "&:focus": {
    outline: "none",
    borderColor: "#363645",
    borderWidth: "1px",
  },
};

const ProductoForm = () => {
  const [view, setView] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      marca: "",
      stock: 0,
      precioLista: 0,
      precioVenta: 0,
      descripcion: "",
      categoriaName: "",
      categoriaId: null, // Inicializa en vacío
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
        const response = await API.post("products/crear-producto", values);
        console.log("Producto creado exitosamente:", response.data);
        alert("Producto creado exitosamente");
      } catch (error) {
        console.error("Error al crear el producto:", error);
        alert("Hubo un error al crear el producto");
      }
    },
  });

  const handleCategorySelect = (categoryId) => {
    formik.setFieldValue("categoriaId", categoryId); // Actualiza el valor en formik
  };

  const handleAddImageField = () => {
    formik.setFieldValue("imagenes", [...formik.values.imagenes, ""]);
  };

  const handleRemoveImageField = (index) => {
    const newImages = formik.values.imagenes.filter((_, i) => i !== index);
    formik.setFieldValue("imagenes", newImages);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: { xs: "1rem", md: "2rem" },
        minHeight: "100vh",
        height: "auto",
        overflowY: "auto",
      }}
    >
      <Typography variant="h4" sx={{ color: "#67677D", fontWeight: "500" }}>
        Crear Producto
      </Typography>
      <Box
        sx={{
          marginTop: formik.values.imagenes.length > 0 ? "1rem" : "0", // Solo agrega espacio extra cuando hay imágenes
          transition: "margin-top 0.3s ease", // Transición suave
          width: "100%",
          border: { xs: "none", md: "1px solid black" },
          borderRadius: "10px",
          padding: { xs: 0, md: 2 },
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{ display: "flex", flexDirection: { xs: "column" }, gap: 2 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
                sx={textFieldStyles}
              />
              <TextField
                label="Marca"
                name="marca"
                value={formik.values.marca}
                onChange={formik.handleChange}
                error={formik.touched.marca && Boolean(formik.errors.marca)}
                helperText={formik.touched.marca && formik.errors.marca}
                sx={textFieldStyles}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0rem 1.5rem",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "#67677D", fontWeight: "500" }}
              >
                Stock / PrecioLista / PrecioVenta
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "1rem",
              }}
            >
              <TextField
                type="number"
                label="Stock"
                name="stock"
                value={formik.values.stock}
                onChange={formik.handleChange}
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
                sx={textFieldStyles}
              />
              <TextField
                type="number"
                label="Precio de Lista"
                name="precioLista"
                value={formik.values.precioLista}
                onChange={formik.handleChange}
                error={
                  formik.touched.precioLista &&
                  Boolean(formik.errors.precioLista)
                }
                helperText={
                  formik.touched.precioLista && formik.errors.precioLista
                }
                sx={textFieldStyles}
              />
              <TextField
                type="number"
                label="Precio de Venta"
                name="precioVenta"
                value={formik.values.precioVenta}
                onChange={formik.handleChange}
                error={
                  formik.touched.precioVenta &&
                  Boolean(formik.errors.precioVenta)
                }
                helperText={
                  formik.touched.precioVenta && formik.errors.precioVenta
                }
                sx={textFieldStyles}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0rem 1.5rem",
              }}
            >
              <Typography variant="h5" sx={{ color: "#67677D" }}>
                Dimensiones
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "1rem",
              }}
            >
              <TextField
                type="number"
                label="Alto"
                name="alto"
                value={formik.values.alto}
                onChange={formik.handleChange}
                error={formik.touched.alto && Boolean(formik.errors.alto)}
                helperText={formik.touched.alto && formik.errors.alto}
                sx={textFieldStyles}
              />
              <TextField
                type="number"
                label="Ancho"
                name="ancho"
                value={formik.values.ancho}
                onChange={formik.handleChange}
                error={formik.touched.ancho && Boolean(formik.errors.ancho)}
                helperText={formik.touched.ancho && formik.errors.ancho}
                sx={textFieldStyles}
              />
              <TextField
                type="number"
                label="Largo"
                name="largo"
                value={formik.values.largo}
                onChange={formik.handleChange}
                error={formik.touched.largo && Boolean(formik.errors.largo)}
                helperText={formik.touched.largo && formik.errors.largo}
                sx={textFieldStyles}
              />
              <TextField
                type="number"
                label="Peso"
                name="peso"
                value={formik.values.peso}
                onChange={formik.handleChange}
                error={formik.touched.peso && Boolean(formik.errors.peso)}
                helperText={formik.touched.peso && formik.errors.peso}
                sx={textFieldStyles}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "100%" },
              marginTop: "1rem",
              gap: 2,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { md: "space-between" },
              height: { md: "auto" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: { xs: "100%", md: "60%" },
              }}
            >
              <Typography variant="h6" sx={{ color: "#67677D" }}>
                Agregar descripcion
              </Typography>
              <TextField
                multiline
                minRows={4}
                placeholder="Descripción del Producto"
                name="descripcion"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                error={
                  formik.touched.descripcion &&
                  Boolean(formik.errors.descripcion)
                }
                helperText={
                  formik.touched.descripcion && formik.errors.descripcion
                }
                sx={textFieldStyles}
                fullWidth
              />
            </Box>
            <Box
              sx={{
                height: { md: "15rem", xs: "100%" },
                display: "flex",
                justifyContent: "start",
                alignItems: { xs: "center", md: "center" },
                flexDirection: { xs: "column" },
              }}
            ></Box>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: "#67677D" }}>
              Seleccionar Categoría
            </Typography>
            <SelectAPI onSelect={handleCategorySelect} />
            {formik.touched.categoriaId && formik.errors.categoriaId && (
              <Typography color="error">{formik.errors.categoriaId}</Typography>
            )}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: "#67677D" }}>
              Agregar imágenes de producto
            </Typography>
            <ImageUploader
              onUploadComplete={(urls) =>
                formik.setFieldValue("imagenes", urls)
              }
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {formik.values.imagenes.map((imagen, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  image={imagen}
                  alt={`Imagen ${index + 1}`}
                  sx={{ width: "100%", height: "auto", borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              height: "8rem",
              justifyContent: { xs: "center", md: "end" },
              alignItems: "center",
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Crear Producto
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ProductoForm;
