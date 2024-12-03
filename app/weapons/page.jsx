"use client";

import { useRouter } from "next/navigation"; 

// Import necessary Material UI components for layout and UI elements
import { Box, Button, Container, IconButton, Paper, Typography } from "@mui/material";

// Import icons for actions like editing and deleting
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import the back arrow icon

// Import DataGrid component for displaying data in a table
import { DataGrid } from "@mui/x-data-grid";

// Import custom components for dialogs and alerts
import WeaponDialog from "./components/weapon-dialog";
import Alerts from "../components/alerts";

// React hooks for state management
import { useState, useEffect } from "react";

// Axios for making HTTP requests to the backend
import axios from "axios";

export default function Weapons() {
  const router = useRouter();

  // Define columns for the DataGrid table
  const columns = [
    { field: "_id", headerName: "ID", width: 30 },
    { field: "named", headerName: "Name", flex: 2 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "cost", headerName: "Cost", flex: 1 },
    { field: "damage", headerName: "Damage", flex: 1 },
    { field: "properties", headerName: "Properties", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
    // Commented out extra field
    // { field: "extra", headerName: "Extra", flex: 1 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <Box>
          {/* Edit button */}
          <IconButton
            color="primary"
            onClick={() => handleWeapon({ action: "edit", weaponData: params.row })}
          >
            <AutoFixHighIcon />
          </IconButton>
          {/* Delete button */}
          <IconButton
            color="secondary"
            onClick={() => deleteWeapon(params.row._id)}
          >
            <WhatshotIcon /> {/* Change icon color to red */}
          </IconButton>
        </Box>
      ),
    },
  ];

  // State variables to manage data and UI states
  const [action, setAction] = useState(""); // Action (edit, add)
  const [openDialog, setOpenDialog] = useState(false); // Open dialog state
  const [rows, setRows] = useState(); // Rows for DataGrid
  const [openAlert, setOpenAlert] = useState(false); // Open alert state
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
  }); // Alert message and severity (error, success)
  const [weaponData, setWeapon] = useState({
    id: null,
    named: "",
    category: "",
    cost: "",
    damage: "",
    properties: "",
    description: "",
    weight: "",
    // extra: ""
  }); // Weapon data to be added or edited

    //To homepage
    const handleBack = () => {
      router.push("/"); // to homepage
    };

  // Fetch the weapons from the server when the component is mounted
  useEffect(() => {
    fetchWeapons();
  }, []); // Empty dependency array means it runs only once when the component mounts

  // Fetch the list of weapons from the backend
  const fetchWeapons = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/weapons");
      setRows(response.data); // Set the fetched weapons to the state
    } catch (error) {
      //console.error("Error fetching weapons", error);
      // Display an alert if there is an error
      setAlert({
        message: "Failed to load weapons",
        severity: "error",
      });
      setOpenAlert(true); // Open the alert
    }
  };

  // Handle the weapon actions (add or edit)
  const handleWeapon = ({ action, weaponData }) => {
    //console.info("Handle weapon action:", action);
    setAction(action); // Set the current action (add/edit)
    setOpenDialog(true); // Open the dialog
    // If adding a weapon, clear the form fields
    if (action === "add") {
      setWeapon({
        id: null,
        named: "",
        category: "",
        cost: "",
        damage: "",
        properties: "",
        description: "",
        weight: "",
        // extra: ""
      });
    } else if (action === "edit") {
      setWeapon(weaponData); // If editing, load the weapon data into the form
    } else {
      //console.warn("Unknown action:", action);
    }
  };

  // Delete a weapon from the database
  const deleteWeapon = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/v1/weapons/${id}`);
      setRows(rows.filter((row) => row._id !== id)); // Remove the deleted weapon from the table
      setAlert({
        message: "Weapon deleted successfully",
        severity: "success",
      });
    } catch (error) {
      //console.error("Error deleting weapon: ", error);
      setAlert({
        message: "Failed to delete weapon",
        severity: "error",
      });
    }
    setOpenAlert(true); // Open the alert with success or error message
  };

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Button to add a new weapon */}
        {/* Button to add a new class */}
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", mb: 2, mt: 2,}}>
        
        {/* Button to Home*/}
        <Button
          onClick={handleBack}
          variant="outlined"

          sx={{
            position: "absolute",
            top: 90,
            left: 30,
            borderRadius: "50%",
            width: 50,
            height: 50,
            minWidth: 0, 
            padding: 0,
          }}
        >
          <ArrowBackIcon />
        </Button>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          WEAPONS
        </Typography>

        {/* Banner */}
        <img
          src="/bannerPages.png"
          alt="Banner"
          style={{
            width: "60%", // Ensures the image fits the container
            objectFit: "cover", // Crops the image proportionally to fill the container
          }}
        />

      {/*Button ADD*/}    
      <Button
          startIcon={<AddCircleIcon />}
          variant="contained"
          sx={{ borderRadius: 3 }}
          onClick={() => handleWeapon({ action: "add" })}
        >
          Add Weapon
        </Button>
      </Box>

      {/* DataGrid table for displaying weapons */}
      <Paper
        sx={{
          padding: 2,
          borderRadius: 2,
          maxWidth: "80%",
          margin: "0 auto",
          height: "400px",
        }}
      >
        <DataGrid
          columns={columns} // Columns to display
          rows={rows} // Data to populate the table
          getRowId={(row) => row._id} // Unique ID for each row
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]} // Page size options for pagination
         
        />
      </Paper>

      {/* Dialog for adding or editing a weapon */}
      <WeaponDialog
        open={openDialog}
        setOpen={setOpenDialog}
        weaponData={weaponData}
        setWeapon={setWeapon}
        action={action}
        rows={rows}
        setRows={setRows}
        setAlert={setAlert}
        setOpenAlert={setOpenAlert}
      />

      {/* Alert component to show error or success messages */}
      <Alerts
        open={openAlert}
        setOpen={setOpenAlert}
        alert={alert}
        setAlert={setAlert}
      />
    </Container>
  );
}
