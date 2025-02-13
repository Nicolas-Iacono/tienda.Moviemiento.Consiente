import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { Typography,  Button,
  Menu,Box} from "@mui/material";
import API from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";
import { useMyUserContext } from "@/context/userContext";

const MenuMobile = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const {user} = useMyUserContext();
  const router = useRouter();
  const [username, setUsername] = useState("")
   const [userLocal, setUserLocal] = useState(null);
 
    useEffect(() => {
      const userStorage = localStorage.getItem("user");
  
      if (userStorage) {
        const user = JSON.parse(userStorage);
        setUserLocal(user);
        if (user && user.first_name && user.last_name) {
          setUsername(`${user.first_name} ${user.last_name}`);
        }
        
      }
    }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  

  const logIn = () => {

    router.push("./login")
    setAnchorEl(null);

  }

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("./login")
    setAnchorEl(null);

  }
  return (
    <div>


      <MenuIcon   id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ cursor: "pointer" }}/>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      > 
      <Box sx={{display:"flex", flexDirection:"column"}}>

              {user ? (
        <Typography>
          {username}
        </Typography>
      ):(
        <Typography>
          Invitado
        </Typography>
      )}
        {user ? 
        (
          <Button onClick={logOut}>
            Cerrar Sesion
          </Button>
        )
        :
        (
          <Button onClick={logIn}>
          Iniciar Sesion
          </Button>
        )
        }
      </Box>

      </Menu>
    </div>
  );
};

export default MenuMobile;
