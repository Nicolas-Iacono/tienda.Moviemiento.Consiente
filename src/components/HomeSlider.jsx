import Slider from "react-slick";
import { Box, Typography, Button } from "@mui/material";
// Datos de ejemplo para el slider
const sliderData = [
  {
    id: 1,
    image: "Banners/BE2.png",
    title: "Descubre los mejores productos",
    description: "Ofertas exclusivas para ti.",
  },

];

const HomeSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 7000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: true,
    
  };

  return (
    <Box sx={{ maxWidth: "100%", overflow: "hidden", margin: "0 auto" }}>
      <Slider {...settings}>
        {sliderData.map((item) => (
          <Box
            key={item.id}
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              width: "40vw", // Ocupa todo el ancho
              height: "50vh",
              background: `url(${item.image}) no-repeat center bottom/cover`,
              objectPosition: "center",
              objectFit:"cover",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "space-around",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: 2,
                borderRadius: 2,
                color: "#fff",
                margin:"0 100px",
                height:"10rem",
                width:"20rem",
                marginTop:"10"
              }}
            >
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {item.description}
              </Typography>
              <Button variant="contained" color="primary">
                Ver más
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HomeSlider;
