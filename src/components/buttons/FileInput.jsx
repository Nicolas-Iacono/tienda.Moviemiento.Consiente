import React, { useRef, useState } from 'react';
import { Box, Button, CircularProgress, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const FileInput = ({ onImageUpload, multiple = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const processImage = async (file) => {
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error procesando imagen:', error);
      throw error;
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setIsLoading(true);
    const newPreviews = [];
    const processedImages = [];

    try {
      for (const file of files) {
        // Validar el tipo de archivo
        if (!file.type.startsWith('image/')) {
          throw new Error('Por favor, seleccione solo archivos de imagen.');
        }

        // Validar el tamaño (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('El tamaño máximo permitido es 5MB por imagen.');
        }

        const dataUrl = await processImage(file);
        newPreviews.push(dataUrl);
        processedImages.push(dataUrl);
      }

      setPreviews([...previews, ...newPreviews]);
      onImageUpload(processedImages);
    } catch (error) {
      console.error('Error procesando imágenes:', error);
      alert(error.message || 'Error al procesar las imágenes. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePreview = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImageUpload(newPreviews);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <Button
        variant="contained"
        startIcon={isLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        fullWidth
        sx={{ mb: 2 }}
      >
        {isLoading ? 'Procesando...' : 'Subir Imágenes'}
      </Button>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {previews.map((preview, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: 100,
              height: 100,
            }}
          >
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: 'white',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
              onClick={() => handleRemovePreview(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FileInput;