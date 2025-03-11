import supabase from "../utils/supabaseClient";
import compressImage from "../utils/compressImage";

const uploadImage = async (file) => {
  if (!file) return null;

  const compressedFile = await compressImage(file); // 🔥 Comprimir antes de subir

  const fileName = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`; // Asegurar extensión WebP
  const { data, error } = await supabase.storage
    .from("productos")
    .upload(fileName, compressedFile, { contentType: "image/webp" });

  if (error) {
    console.error("Error subiendo imagen:", error);
    return null;
  }

  // Obtener la URL pública
  const { data: urlData } = supabase.storage.from("productos").getPublicUrl(fileName);
  return urlData.publicUrl;
};
export default uploadImage;