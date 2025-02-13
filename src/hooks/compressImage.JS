import imageCompression from "browser-image-compression";

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.3, // Peso máximo de la imagen (ajusta según necesidad)
    maxWidthOrHeight: 800, // Redimensiona la imagen
    useWebWorker: true, // Mejora el rendimiento
    fileType: "image/webp", // Convertir a WebP
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error al comprimir la imagen:", error);
    return file; // Si falla, usa la imagen original
  }
};
export default compressImage;