import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import API from "@/utils/api";

const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const mounted = useRef(true);

  // Función para limpiar el controlador actual
  const cleanupController = useCallback(() => {
    try {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    } catch (error) {
      console.log('Error al cancelar la búsqueda:', error);
    }
  }, []);

  // Crear una función de búsqueda debounced que cancela la petición anterior
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim() || !mounted.current) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Limpiar el controlador anterior
      cleanupController();

      // Crear nuevo controlador
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      try {
        const { data } = await API.get(`/products/search?query=${searchQuery}`, {
          signal: controller.signal
        });
        
        if (mounted.current) {
          setResults(data);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Búsqueda cancelada');
        } else {
          console.error("Error en la búsqueda:", error);
          if (mounted.current) {
            setResults([]);
          }
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    }, 300),
    [cleanupController] // Added cleanupController as dependency
  );

  // Efecto para manejar la búsqueda
  useEffect(() => {
    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel();
      cleanupController();
    };
  }, [query, debouncedSearch, cleanupController]);

  // Efecto para limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      mounted.current = false;
      cleanupController();
      debouncedSearch.cancel();
    };
  }, [cleanupController, debouncedSearch]);

  // Función para limpiar los resultados manualmente
  const clearResults = useCallback(() => {
    setResults([]);
    setLoading(false);
    cleanupController();
    debouncedSearch.cancel();
  }, [cleanupController, debouncedSearch]);

  return { 
    results, 
    loading, 
    clearResults 
  };
};

export default useSearch;
