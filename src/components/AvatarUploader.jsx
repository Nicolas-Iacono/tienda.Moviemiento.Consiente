import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';
import { Box, CircularProgress, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// Inicializa el cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jogykgijckiappwwefld.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZ3lrZ2lqY2tpYXBwd3dlZmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzQ4MTgsImV4cCI6MjA0OTk1MDgxOH0.X-DdqQ8_jZuLy0mbc2wTHD9KrNLWM3GutQFxnE2QKqU";
const supabase = createClient(supabaseUrl, supabaseKey);


const AvatarUploader = ({ onUploadComplete }) => {
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
    <Box 
      sx={{ 
        position: 'absolute',
        top: -8,
        right: -8,
        zIndex: 1000,
      }}
    >
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="avatar-upload-button"
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label htmlFor="avatar-upload-button">
        <IconButton
          component="span"
          disabled={uploading}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            width: '32px',
            height: '32px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          {uploading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            <CameraAltIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
          )}
        </IconButton>
      </label>
    </Box>
  );
};

export default AvatarUploader;
