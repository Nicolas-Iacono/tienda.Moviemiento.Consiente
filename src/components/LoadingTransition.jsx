import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const LoadingContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  zIndex: 9999,
});

const Logo = styled(Typography)({
  color: '#C3DE5A',
  fontWeight: 'bold',
  marginTop: '40px',
  fontSize: '1.5rem',
});

const ParallelogramContainer = styled(Box)({
  position: 'relative',
  width: '100px',
  height: '100px',
});

const Parallelogram = styled(motion.div)(({ theme, isTop }) => ({
  position: 'absolute',
  width: '60px',
  height: '30px',
  backgroundColor: '#C3DE5A',
  transform: 'skewX(-40deg)',
  left: isTop ? '0' : '40px',
  top: isTop ? '20px' : '50px',
  
}));

const LoadingTransition = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LoadingContainer>
        <ParallelogramContainer>
          <Parallelogram
            isTop
            animate={{
              x: [-10, 10, -10],
              rotate: [0, 0, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <Parallelogram
            animate={{
              x: [10, -10, 10],
              rotate: [0, 0, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </ParallelogramContainer>
        <Logo variant="h6" component={motion.h6}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          Movimiento Consiente
        </Logo>
      </LoadingContainer>
    </motion.div>
  );
};

export default LoadingTransition;
