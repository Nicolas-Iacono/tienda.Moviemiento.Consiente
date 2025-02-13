import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

const emptyUser = {
  email: null,
  token: null,
  first_name: null,
  last_name: null,
  authorities: []
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(emptyUser);

  // Cargar usuario desde localStorage cuando el componente se monta (solo cliente)
  useEffect(() => {
    const storedUser = window?.localStorage?.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        updateUserStates(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        window?.localStorage?.removeItem("user");
      }
    }
  }, []);

  const isUser = () => {
    return user?.authorities?.includes("ROLE_USER");
  };

  const isAdmin = () => {
    return user?.authorities?.includes("ROLE_ADMIN");
  };

  const updateUserStates = (userData) => {
    if (!userData) {
      setUser(emptyUser);
      return;
    }
    setUser(userData);
  };

  const setUserWithToken = (token) => {
    try {
      // Si no hay token, limpiar el estado
      if (!token) {
        updateUserStates(null);
        return;
      }

      // Validar que el token sea una cadena
      if (typeof token !== 'string') {
        throw new Error('Token inválido: debe ser una cadena');
      }

      const decoded = jwtDecode(token);
      
      // Validar que el token decodificado tenga los campos necesarios
      if (!decoded.email || !decoded.id) {
        throw new Error('Token inválido: falta información requerida');
      }

      const userData = {
        email: decoded.email,
        token: token,
        id: decoded.id,
        first_name: decoded.first_name || '',
        last_name: decoded.last_name || '',
        authorities: Array.isArray(decoded.authorities) ? decoded.authorities : []
      };
      
      window?.localStorage?.setItem("user", JSON.stringify(userData));
      updateUserStates(userData);

      // Disparar eventos de storage para sincronizar otras pestañas
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(userData)
        }));
      }
    } catch (error) {
      console.error('Error al procesar el token:', error);
      // Limpiar el estado y localStorage en caso de error
      window?.localStorage?.removeItem("user");
      updateUserStates(null);
      throw error;
    }
  };

  const logout = () => {
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      window?.localStorage?.removeItem("user");
      window?.localStorage?.removeItem("carrito");
      
      // Disparar eventos de storage para sincronizar otras pestañas
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user',
        newValue: null
      }));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'carrito',
        newValue: null
      }));
    }

    // Actualizar estados
    updateUserStates(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: updateUserStates,
      setUserWithToken,
      logout, 
      isUser, 
      isAdmin 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useMyUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  return context;
};
