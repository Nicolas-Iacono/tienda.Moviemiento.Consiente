import React, { useState, useEffect } from "react";
import { Box, Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import API from "@/utils/api";
const SelectAPI = ({ onSelect }) => {
  const [options, setOptions] = useState([]); // Estado para guardar las opciones.
  const [selectedOption, setSelectedOption] = useState(""); // Estado para la opción seleccionada.

  // Función para obtener los datos de la API.
  const fetchOptions = async () => {
    try {
      const response = await API.get("/category/all"); // Cambia la URL por tu API.
      setOptions(response.data); // Asume que la respuesta contiene un array de objetos.
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  // useEffect para llamar a la API cuando el componente se monta.
  useEffect(() => {
    fetchOptions();
  }, []);

  // Manejador para el cambio de opción.
  const handleChange = (event) => {
    const selectedIndex = event.target.selectedIndex - 1; // Menos 1 para excluir la opción predeterminada.
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (onSelect) {
      onSelect(selectedValue, selectedIndex); // Pasar el valor y el índice al componente padre.
      console.log(selectedValue);
    }
  };

  return (
    <Box sx={{ minWidth: 120, width: {md:"14rem", xs:"100%"}
    }}>
      <FormControl fullWidth>
        <InputLabel id="api-select-label">Selecciona una opción</InputLabel>
        <Select
          labelId="api-select-label"
          id="api-select"
          value={selectedOption}
          onChange={handleChange}
        >
          <MenuItem value="" disabled>
            Seleccionar...
          </MenuItem>
          {options.map((option, index) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name} {/* Asegúrate de usar las propiedades correctas según tu API */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedOption && <p>Opción seleccionada: {selectedOption}</p>}
    </Box>
  );
};

export default SelectAPI;
