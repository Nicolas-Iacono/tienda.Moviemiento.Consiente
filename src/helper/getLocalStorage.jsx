export const getLocalStorage = (key) => {
  if(typeof window !== "undefined"){
    return localStorage.getItem(key);
  }
  return null;
};

export default getLocalStorage;