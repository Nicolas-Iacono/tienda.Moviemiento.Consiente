import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';
import { Box, LinearProgress, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Inicializa el cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jogykgijckiappwwefld.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ImageUploader = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const convertToWebP = async (file) => {
    try {
      // Primero comprimimos la imagen
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Creamos un canvas para convertir la imagen a WebP
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Convertimos a WebP
          canvas.toBlob((blob) => {
            resolve(new File([blob], `${file.name.split('.')[0]}.webp`, {
              type: 'image/webp'
            }));
          }, 'image/webp');
        };
        
        img.src = URL.createObjectURL(compressedFile);
      });
    } catch (error) {
      console.error('Error al convertir a WebP:', error);
      throw error;
    }
  };

  const uploadToSupabase = async (file) => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('mega-ofertas') // Asegúrate de que este bucket existe en tu proyecto de Supabase
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('mega-ofertas')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error al subir a Supabase:', error);
      throw error;
    }
  };

  const handleFileChange = async (event) => {
    try {
      const files = Array.from(event.target.files);
      setUploading(true);
      setProgress(0);

      const uploadedUrls = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Verificar si ya es WebP
        let processedFile;
        if (file.type === 'image/webp') {
          processedFile = file;
        } else {
          processedFile = await convertToWebP(file);
        }

        const url = await uploadToSupabase(processedFile);
        uploadedUrls.push(url);
        
        // Actualizar progreso
        setProgress(((i + 1) / totalFiles) * 100);
      }

      onUploadComplete(uploadedUrls);
    } catch (error) {
      console.error('Error en el proceso de carga:', error);
      // Aquí podrías agregar un manejo de errores más amigable para el usuario
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload-button"
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label htmlFor="image-upload-button">
        <IconButton
          component="span"
          disabled={uploading}
          sx={{
            width: '100%',
            height: '100px',
            border: '2px dashed #ccc',
            borderRadius: '4px',
            '&:hover': {
              border: '2px dashed #666',
            },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography>
              {uploading ? 'Subiendo...' : 'Seleccionar imágenes'}
            </Typography>
          </Box>
        </IconButton>
      </label>
      
      {uploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;
