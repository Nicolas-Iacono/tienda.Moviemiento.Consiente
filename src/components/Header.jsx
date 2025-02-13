import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  InputBase,
  IconButton,
  useMediaQuery,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useMyUserContext } from "@/context/userContext";
import MenuCategoria from "./MenuCategoria";
import CarritoCompras from "./CarritoCompras";
import { useRouter } from "next/router";
import HeaderMobile from "../components/header/HeaderMobile"
import HeaderDesk from "../components/header/HeaderDesk"
import Link from 'next/link';


export const Header = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [carritoView, setCarritoView] = useState(false)
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null);
  const router = useRouter();
const {isAdmin,isUser} = useMyUserContext();
  
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("./login")
  }

  useEffect(() => {
    const userStorage = localStorage.getItem("user");

    if (userStorage) {
      const user = JSON.parse(userStorage);
      setUser(user);
      setUsername(`${user.first_name} ${user.last_name}`);
    }
  }, []);
  

  const verCarrito = () => {
    setCarritoView(!carritoView); // Alterna entre true y false
    console.log("Estado previo:", carritoView); // Muestra el estado previo
  };
  
  // Efecto para ver el cambio en el estado
  useEffect(() => {
    console.log("Estado actualizado:", carritoView);
  }, [carritoView]);


  const linkStyles = {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "15px",
    fontSize: "16px",
  };

  return (
    <>
      {isMobile ? (<HeaderMobile/>):(<HeaderDesk/>)}
    </>
  );
};
