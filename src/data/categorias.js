const categorias = [
  {
    id: 1,
    name: 'Tecnología y Accesorios',
    slug: 'tecnologia-y-accesorios',
    description: 'Encuentra los últimos gadgets y accesorios tecnológicos',
    img: '/categorias/macCat.svg',
    backgroundColor: '#e3f2fd',
    featured: true
  },
  {
    id: 2,
    name: 'Gaming',
    slug: 'gaming',
    description: 'Todo para los amantes de los videojuegos',
    img: '/categorias/gaming.png',
    backgroundColor: '#f3e5f5',
    featured: true
  },
  {
    id: 3,
    name: 'Celulares',
    slug: 'celulares',
    description: 'Los mejores smartphones y accesorios',
    img: '/categorias/iphoneCat.svg',
    backgroundColor: '#e8f5e9',
    featured: true
  },
  {
    id: 4,
    name: 'Juguetes',
    slug: 'juguetes',
    description: 'Juguetes para todas las edades',
    img: '/categorias/toys.svg',
    backgroundColor: '#fff3e0',
    featured: false
  }
];

export const getCategoryBySlug = (slug) => {
  return categorias.find(category => category.slug === slug);
};

export const getFeaturedCategories = () => {
  return categorias.filter(category => category.featured);
};

export default categorias;