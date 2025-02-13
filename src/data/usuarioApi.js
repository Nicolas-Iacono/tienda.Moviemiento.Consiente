
import API from '@/utils/api';


const usuarioApi =  {

  registrarUsuario:async(usuario) => {
  try{
    const response = await API.post(`/registrar-admin`, usuario);
    return response.data;
  }catch (error){
    console.error('Error al registrar usuario:', error);
    throw new Error("Error al registrar usuario", error);
    }
  },

    login: async (usuario) => {
      try {
        const response = await API.post(`/login`, usuario);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Error al iniciar sesión");
      }
    },

  }
export default usuarioApi