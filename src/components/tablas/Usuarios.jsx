import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import API from "@/utils/api";

const ExpandableRow = ({ person }) => {
  const [open, setOpen] = useState(false);

  // Si no existe address o phone, podemos asignar valores por defecto
  const address = person.address || {};
  const phone = person.phone || {};

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{person.first_name || "N/A"}</TableCell>
        <TableCell>{person.last_name || "N/A"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} style={{ padding: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                <TableRow
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContentL: "center",
                    alignItems: "center",
                    backgroundColor: "#C3DE5A",
                  }}
                >
                  <TableCell sx={{ color: "white" }}>
                    <strong>Dirección</strong>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {address.street_name
                      ? `${address.street_name} ${
                          address.street_number || ""
                        }, Piso ${address.floor || ""}, Dpto ${
                          address.apartment || ""
                        }, ${address.city_name || ""}, CP: ${
                          address.zip_code || ""
                        }`
                      : "No disponible"}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContentL: "center",
                    alignItems: "center",
                    backgroundColor: "#C3DE5A",
                  }}
                >
                  <TableCell
                    sx={{
                      color: "white",
                    }}
                  >
                    <strong>Teléfono</strong>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {phone.area_code && phone.number
                      ? `(${phone.area_code}) ${phone.number}`
                      : "No disponible"}
                  </TableCell>
                </TableRow>

                <TableRow
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContentL: "center",
                    alignItems: "center",
                    backgroundColor: "#C3DE5A",
                    color: "white",
                  }}
                >
                  <TableCell sx={{ color: "white" }}>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {person.email || "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const PersonTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await API.get("/users/all"); // Asegúrate de que la ruta sea la correcta
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: { xs: "5rem", md: "0rem" } }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((person, index) => (
            <ExpandableRow key={index} person={person} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PersonTable;
