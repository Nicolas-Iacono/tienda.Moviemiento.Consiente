

import { useEffect, useState } from "react";
import {Box, Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { useRouter } from "next/router";
import LikeButton from "../components/buttons/ProductLikeButton"

const ProductCardCategory = ({ id, name, price, image, brand }) => {
  const router = useRouter();
 const [user, setUser] = useState(null);

 
   useEffect(() => {
   const storedUser = localStorage.getItem("user");
   if (storedUser) {
     setUser(JSON.parse(storedUser));
   }
 }, []);
 
   const userId = user ? user.id : null;
 
  const handleViewDetails = () => {
    router.push(`/product/${id}`);
  };
  const porcentajeReduction = (price, priceList) => {
    if (priceList > price) {
      return Math.round(((priceList-price) / priceList) * 100);
    }
    return 0; 
  };

  return (
<Card elevation={8} key={id} sx={{width:{md:"15rem", xs:"10rem"}, height:{md:"22rem", xs:"15rem"}, display:"flex", flexDirection:"column", backgroundColor:"white", borderRadius:"25px",padding:{xs:".5rem",md:"1rem"}, cursor:"pointer", transition: "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out",
    "&:hover": {
      boxShadow: 15,
      transform: "translateY(-5px)", 
    },}}>
    
    <CardMedia  sx={{width:"100%", height:"9rem", backgroundPosition:"center center", backgroundRepeat:"no-repeat", backgroundSize:"cover", borderRadius:"20px", }}
          image={image}
          alt={name || "Imagen del producto"}
      >
    </CardMedia>
    <CardContent sx={{ width:"90%", height:"50%",display:"flex", flexDirection:"column", flexWrap:"nowrap",justifyContent:"space-between",alignItems:"start",
    padding:".2rem"
    }}>
      <Box sx={{display:"flex",flexDirection:"column",}}>

      <Typography variant='body2' sx={{color:"black", color:"gray", }}>
        {brand} 
      </Typography>
      <Typography variant='body2' sx={{color:"black",}}>
        {name} 
      </Typography>
      </Box>

      <Typography variant='h6' sx={{color:"black"}}>
          $ {price}
      </Typography>

    </CardContent>
    <CardActions sx={{backgroundColor:"rgb(250, 241, 233)", borderRadius:"20px", display:"flex", justifyContent:"space-between"}}>
        <Button variant='contained'
      onClick={() => handleViewDetails(id)}
      sx={{borderRadius:"20px", height:{xs:"2rem"}}}>
          <Typography  variant="body2"  sx={{
              color: "white",
              textAlign: "center",
              textTransform: "lowercase",
            }}>
              Ver producto
          </Typography>
        </Button>
        <LikeButton productId={id} userId={userId} sx={{width:{xs:"1rem"},height:"1rem"}}/>
    </CardActions>
    
</Card>
  );
};

export default ProductCardCategory;
