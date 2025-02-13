import axios from 'axios'
import { useEffect, useState } from 'react'



export const useAxios = (url) =>{
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading,setLoading] = useState(null)

  useEffect(() =>{
    const axiosData = async () =>{
      try{
        const response = await axios.get(url);
        setData(response.data);
      }catch(error){
        setError(error);
      }finally{
        setLoading(false);
      }
    };
    axiosData();

  }, [url]);

  return {data, error, isLoading};
};

export const postAxios = async (endpoint, payload) => {
  try{
    const response = await axios.post(endpoint, payload);
    return response.data;
  }catch(error) {
    throw error;
  }
}
