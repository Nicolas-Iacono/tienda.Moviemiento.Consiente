import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const CarritoContextProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const carritoGuardado = window?.localStorage?.getItem("carrito");
    if (carritoGuardado) {
      try {
        const carritoInicial = JSON.parse(carritoGuardado);
        setCarrito(carritoInicial);
      } catch (error) {
        console.error("Error al parsear el carrito:", error);
        setCarrito([]);
      }
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (carrito.length > 0) {
        window.localStorage.setItem("carrito", JSON.stringify(carrito));
      } else {
        window.localStorage.removeItem("carrito");
      }
    }
  }, [carrito]);

  // Escuchar cambios en localStorage para mantener el carrito sincronizado
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === "carrito") {
        const nuevoCarrito = e.newValue ? JSON.parse(e.newValue) : [];
        setCarrito(nuevoCarrito);
      }
      if (e.key === "user" && !e.newValue) {
        setCarrito([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const normalizedProduct = {
      id: producto.id,
      name: producto.nombre || producto.name,
      brand: producto.marca || producto.brand,
      price: producto.precioVenta || producto.price,
      imagenes: producto.imagenes || producto.images,
      description: producto.descripcion || producto.description,
      cantidad: 1
    };

    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(item => item.id === normalizedProduct.id);
      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id === normalizedProduct.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevCarrito, normalizedProduct];
    });
  };

  // Incrementar cantidad de un producto
  const incrementarCantidad = (productoId) => {
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  // Decrementar cantidad de un producto
  const decrementarCantidad = (productoId) => {
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === productoId && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (productoId) => {
    setCarrito(prevCarrito =>
      prevCarrito.filter(item => item.id !== productoId)
    );
  };

  // Vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem("carrito");
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        incrementarCantidad,
        decrementarCantidad,
        vaciarCarrito
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useMyCarritoContext = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("CarritoContext must be used within a CarritoContextProvider");
  }
  return context;
};
