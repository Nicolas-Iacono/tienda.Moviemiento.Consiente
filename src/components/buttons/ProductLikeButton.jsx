import { IconButton, CircularProgress } from "@mui/material";
import API from "../../utils/api";
import useHasLiked from "./useHasLiked";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMyUserContext } from "@/context/userContext";
import Swal from 'sweetalert2';

const ProductLikeButton = ({ productId }) => {
  const { user } = useMyUserContext();
  const { hasLiked, setHasLiked, loading, error } = useHasLiked(user?.id, productId);
  const router = useRouter();

  const handleLikeToggle = async (e) => {
    e.stopPropagation(); // Detener la propagación del evento
    
    if (!user?.id) {
      Swal.fire({
        title: 'Inicio de sesión requerido',
        text: 'Debes iniciar sesión para dar me gusta',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Ir a login',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    try {
      if (hasLiked) {
        await API.delete(`/like`, {
          data: { userId: user.id, productId }
        });
      } else {
        await API.post(`/like`, {
          userId: user.id,
          productId
        });
      }
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Error al gestionar el like:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al procesar tu me gusta',
        icon: 'error'
      });
    }
  };

  if (loading) {
    return (
      <IconButton disabled>
        <CircularProgress size={24} />
      </IconButton>
    );
  }

  return (
    <IconButton
      onClick={handleLikeToggle}
      sx={{
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: 'white'
        },
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '8px'
      }}
    >
      <Image
        src={hasLiked ? "/iconos/corazonRojo.png" : "/iconos/corazonTransparente.png"}
        alt={hasLiked ? "Me gusta" : "No me gusta"}
        width={20}
        height={20}
        style={{ 
          objectFit: 'contain',
          filter: hasLiked ? 'none' : 'opacity(0.5)'
        }}
      />
    </IconButton>
  );
};

export default ProductLikeButton;