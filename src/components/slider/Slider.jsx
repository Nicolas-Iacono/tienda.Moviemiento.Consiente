import React, {useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../styles/slideStyles.css'
import { EffectFade, Navigation, Pagination } from 'swiper/modules';
import { useRouter } from "next/router";
import {Typography,Box,Button} from '@mui/material' 
import API from '@/utils/api';
const Slider = () => {
    const [products, setProducts] = useState([]);
    const router = useRouter();

    const handleViewDetails = (id) => {
      router.push(`/product/${id}`);
    };

    const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    };

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await API.get('/products/latestfive');
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      fetchProducts();
    }, []);



  return (
   <>
   <Swiper
        autoplay={true}
        spaceBetween={30}
        effect={'fade'}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
      >

        {products.map((product)=>(
            <SwiperSlide key={product.id}>
              <Box sx={{display:"flex", justifyContent:"space-around", alignItems:"center", backgroundColor:"rgb(255, 240, 234)", height:"100%", borderRadius:"0px 0px 25px 25px"}}> 
              <Box sx={{ display:"flex" , justifyContent:"space-between",flexDirection:"column",padding:"2rem",width:"47%", height:"90%"}}>
                              <Typography variant="body1" fontWeight="bold" sx={{color:"gray"}}>
                                {product.brand}
                              </Typography>
                              <Typography variant="h5" color="textSecondary">
                                {product.name}
                              </Typography>
                              <Typography variant="body3" color="textSecondary">
                                {truncateText(product.descripcion, 60)}
                              </Typography>
                              <Typography variant="h5" color="primary" mt="0.5rem">
                                ${product.price}
                              </Typography>
            
                             
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <Button variant="contained" color="primary"
                            onClick={() => handleViewDetails(product.id)} sx={{borderRadius:"20px"}}>
                              <Typography sx={{
                                color: "white",
                                textAlign: "center",
                                textTransform: "lowercase",
                              }}>
                                Ver más
                              </Typography>
                              
                            </Button>
                          </Box>
                            </Box>

              <Box sx={{   backgroundImage:
      product.imagenes && product.imagenes.length > 0
        ? `url(${product.imagenes[0]})`
        : `url('/default-image-url.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%", // Ajusta según sea necesario
    height: "100%",
    borderRadius:"0 0 25px 0"}}>
              {/* <img
                    src={
                      product.imagenes && product.imagenes.length > 0
                        ? product.imagenes[0]
                        : 'default-image-url.jpg'
                    }
                    alt={product.name}
                    style={{
                      width:"100%",
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '30px',
                    }}
                  />  */}
              </Box>
              </Box>
            

            </SwiperSlide>
        ))}

     
      </Swiper>
    </>
  );
}
  

export default Slider