import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Image from 'next/image';
import axios from 'axios';
import { useMyUserContext } from '@/context/userContext';
import { useRouter } from 'next/router';
import API from '@/utils/api';

const HeroSlider = () => {
  const { isAdmin, user } = useMyUserContext();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [titleAnimation, setTitleAnimation] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchUserGallery = async () => {
      try {
        if (user && user.id) {
          const response = await API.get(`/galery/users/${user.id}/galery`);
          if (response.data.images) {
            setGalleryImages(response.data.images);
          }
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Fallback to default images if API fails
        setGalleryImages([]);
      }
    };

    fetchUserGallery();
  }, [user]);

  console.log(galleryImages);   
  const handleSlideChange = (splide) => {
    setTitleAnimation(true);
    setCurrentSlide(splide.index);
    setTimeout(() => setTitleAnimation(false), 1000);
  };

  return (
    <SliderContainer>
      <Splide
        options={{
          type: 'fade',
          rewind: true,
          arrows: false,
          autoplay: true,
          interval: 5000,
          speed: 1000,
          height: '80vh',
        }}
        onMoved={handleSlideChange}
      >
        {galleryImages.map((image, index) => (
          <SplideSlide key={index}>
            <SlideImageContainer>
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
            </SlideImageContainer>
          </SplideSlide>
        ))}
      </Splide>

      <TitleContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 1, x: 0 }}
            animate={titleAnimation ? { opacity: 0, x: -100 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TitleWord variant="h6">Movimiento</TitleWord>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 1, x: 0 }}
            animate={titleAnimation ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TitleWord variant="h6">Consiente</TitleWord>
          </motion.div>
        </AnimatePresence>
      </TitleContainer>

      <ScrollIndicator>
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
        </motion.div>
      </ScrollIndicator>
    </SliderContainer>
  );
};

const SliderContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '80vh',
});

const SlideImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
});

const TitleContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
  display: 'flex',
  gap: '20px',
  color: 'white',
  textAlign: 'center',
});

const TitleWord = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 700,
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
});

const ScrollIndicator = styled(Box)({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'white',
  zIndex: 10,
  cursor: 'pointer',
});

export default HeroSlider;
