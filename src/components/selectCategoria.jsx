import React, { useState, useEffect } from "react";
import { Box, Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import API from "@/utils/api";

const selectStyles = {
  backgroundColor: "#24242F",
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    '&.Mui-focused': {
      color: '#363645'
    }
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#333340',
    },
    '&:hover fieldset': {
      borderColor: '#363645',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#363645',
      borderWidth: '1px',
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#363645',
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
};

const menuItemStyles = {
  backgroundColor: "#24242F",
  color: 'white',
  '&:hover': {
    backgroundColor: '#363645',
  },
  '&.Mui-selected': {
    backgroundColor: '#363645',
    '&:hover': {
      backgroundColor: '#363645',
    },
  },
};

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
    <Box sx={{ minWidth: 120, width: {md:"14rem", xs:"100%"} }}>
      <FormControl 
        fullWidth
        sx={{
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#363645',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#363645',
          },
        }}
      >
        <InputLabel id="api-select-label" sx={{ color: 'white' }}>Selecciona una opción</InputLabel>
        <Select
          labelId="api-select-label"
          id="api-select"
          value={selectedOption}
          onChange={handleChange}
          sx={selectStyles}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: '#24242F',
                '& .MuiMenuItem-root': menuItemStyles,
              },
            },
          }}
          inputProps={{
            sx: {
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#363645 !important',
                },
              },
            },
          }}
        >
          <MenuItem value="" disabled sx={menuItemStyles}>
            Seleccionar...
          </MenuItem>
          {options.map((option, index) => (
            <MenuItem key={option.id} value={option.id} sx={menuItemStyles}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedOption && <p style={{ color: '#454553' }}>Opción seleccionada: {selectedOption}</p>}
    </Box>
  );
};

export default SelectAPI;
