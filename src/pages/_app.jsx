// pages/_app.js
import Layout from "../components/Layout";
import {UserContextProvider} from "../context/userContext.jsx";
import { CategoryContextProvider } from "@/context/categoryContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CarritoContextProvider } from "@/context/carritoContext";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LoadingTransition from '../components/LoadingTransition';

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: "es-AR" });

const theme = createTheme({
  palette: {
    primary: {
      main: "#C3DE5A",
    },
  },
});

const cache = createCache({
  key: 'css',
  prepend: true,
});

export default function MyApp({ Component, pageProps }) {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      // Solo mostrar la carga cuando navegamos entre blog y tienda
      const isBlogToStore = (router.pathname === '/blog' && url === '/');
      const isStoreToBlog = (router.pathname === '/' && url === '/blog');
      
      if (isBlogToStore || isStoreToBlog) {
        setIsLoading(true);
      }
    };

    const handleComplete = () => {
      // Solo aplicar el timeout si estamos cargando
      if (isLoading) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    const handleError = () => {
      if (isLoading) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router, isLoading]);

  const getLayout =
    Component.getLayout || ((page) => (
      <Layout style={{backgroundColor:"blue"}}>
        {page}
      </Layout>
    ));

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoading && <LoadingTransition />}
        <CategoryContextProvider>
          <CarritoContextProvider>
            <UserContextProvider>
              {getLayout(<Component {...pageProps} />)}
            </UserContextProvider>
          </CarritoContextProvider>
        </CategoryContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
