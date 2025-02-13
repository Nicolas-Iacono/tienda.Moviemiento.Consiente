import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import API from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const MenuCategoria = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [categorias, setCategorias] = React.useState([]);
  const [categoriaId, setCategoriaId] = React.useState([]);



  useEffect(() => {
    // Obtener todas las categorías al cargar
    API.get(`category/all`)
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const router = useRouter();
  const handleCategoryClick = (id) => {
    setAnchorEl(null); 
    router.push(`/category/${id}`);

  };

  return (
    <div>
      <Typography
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
      >
        Categorías
      </Typography>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {categorias.map((categoria) => (
          <MenuItem
            key={categoria.id}
            onClick={() => handleCategoryClick(categoria.id)} 
          >
            {categoria.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuCategoria;
