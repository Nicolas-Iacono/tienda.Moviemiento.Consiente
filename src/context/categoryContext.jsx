import { createContext, useContext, useState, useEffect } from "react";

const CategoryContext = createContext(null); // Valor inicial null

export const CategoryContextProvider = ({ children }) => {
  const [category, setCategory] = useState({
    id: null, // Inicializar id como null
    name: "",
    products: [],
    loading: false, // Estado de carga
    error: null,    // Estado de error
  });

  const [products, setProducts] = useState([])

  const fetchCategory = async (categoryId) => {
    setCategory(prevCategory => ({...prevCategory, loading: true, error: null})); // Indicamos que se está cargando
    try {
      if (categoryId) { //Solo hacer la llamada si existe un ID
        const response = await fetch(`http://localhost:5000/category/${categoryId}`); // Reemplaza con tu endpoint real
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Lanzar error si la respuesta no es ok
        }
        const data = await response.json();
        setCategory({ ...data, loading: false, error: null });
      } else {
          setCategory({ id: null, name: '', products: [], loading: false, error: null }); // Reiniciar la categoría si el ID es null
          setProducts(category.products)
      }
    } catch (error) {
      setCategory(prevCategory => ({...prevCategory, loading: false, error: error.message})); // Manejo de errores
      console.error("Error fetching category:", error); // Log para depuración
    }
  };
console.log(products); //
  useEffect(() => {
      fetchCategory(category.id);
  }, [category.id]);

  const updateCategory = (newCategoryData) => {
      setCategory(prevCategory => ({...prevCategory, ...newCategoryData}));
  }

  return (
    <CategoryContext.Provider value={{ category, setCategory, fetchCategory, updateCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory debe ser usado dentro de un CategoryContextProvider"); // Mensaje de error más específico
  }
  return context;
};