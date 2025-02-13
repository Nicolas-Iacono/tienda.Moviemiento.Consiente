// pages/_app.js
import Layout from "../components/Layout";
import {UserContextProvider} from "../context/userContext.jsx";
import { CategoryContextProvider } from "@/context/categoryContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CarritoContextProvider } from "@/context/carritoContext";
import { initMercadoPago } from "@mercadopago/sdk-react";

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: "es-AR" });

export default function MyApp({ Component, pageProps }) {

  const theme = createTheme({
    palette: {
      primary: {
        main: "#e8621d",
      },
    },
  });
  const getLayout =
    Component.getLayout || ((page) => (
      <Layout style={{backgroundColor:"blue"}}>
        {page}
      </Layout>
    ));

  return (
  
  <ThemeProvider theme={theme}>

      <CategoryContextProvider>
      <CarritoContextProvider>

            <UserContextProvider>

            {getLayout(<Component {...pageProps} />)}
              
            </UserContextProvider>

      </CarritoContextProvider>
      </CategoryContextProvider>

  </ThemeProvider>
  );
}
