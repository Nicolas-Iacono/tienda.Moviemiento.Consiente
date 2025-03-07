// pages/_app.jsx
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
import Head from 'next/head';
import { registerServiceWorker } from '../utils/registerSW';

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
    // Register service worker for PWA functionality
    registerServiceWorker();

    const handleStart = (url) => {
      const isBlogToStore = (router.pathname === '/blog' && url === '/');
      const isStoreToBlog = (router.pathname === '/' && url === '/blog');
      
      if (isBlogToStore || isStoreToBlog) {
        setIsLoading(true);
      }
    };

    const handleComplete = () => {
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
        <Head>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="MC Store" />
        </Head>
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
