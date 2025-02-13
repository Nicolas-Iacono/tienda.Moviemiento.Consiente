import { useState, useEffect } from "react";
import API from "../../utils/api";

const useHasLiked = (userId, productId) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLike = async () => {
      // Si no hay userId o productId, no hacer la petición
      if (!userId || !productId) {
        setLoading(false);
        return;
      }
  
      try {
        const response = await API.get(`like/products/${productId}/likes/${userId}`);
        setHasLiked(response.data.hasLiked);
      } catch (error) {
        // Si el error es 404, significa que no hay like
        if (error.response?.status === 404) {
          setHasLiked(false);
        } else {
          console.error("Error al verificar el like:", error);
          setError(error.response?.data?.message || "Error al verificar el like");
        }
      } finally {
        setLoading(false);
      }
    };
  
    checkLike();
  }, [userId, productId]);

  return { hasLiked, setHasLiked, loading, error };
};

export default useHasLiked;
