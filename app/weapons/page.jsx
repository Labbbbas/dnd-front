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
    {
      field: "named", 
      headerName: "Name",
      width: 130,
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center",
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Name
        </Box>
      ),
      renderCell: (params) => (
        // So it doesn't look so crowded
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "category", 
      headerName: "Category", 
      width: 130,
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Category
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ 
          whiteSpace: 'normal', 
          wordWrap: 'break-word', 
          textAlign: 'center', 
          paddingTop: '8px', 
          paddingBottom: '8px' 
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "cost", 
      headerName: "Cost", 
      width: 100, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center",
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Cost
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "damage", 
      headerName: "Damage", 
      width: 150, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Damage
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "properties", 
      headerName: "Properties", 
      width: 200, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Properties
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "description", 
      headerName: "Description", 
      width: 240, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "justify", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Description
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ 
          whiteSpace: 'normal', 
          wordWrap: 'break-word', 
          textAlign: 'justify', 
          paddingTop: '8px', 
          paddingBottom: '8px' 
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "weight", 
      headerName: "Weight", 
      width: 100, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "justify", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Weight
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ 
          whiteSpace: 'normal', 
          wordWrap: 'break-word', 
          textAlign: 'center', 
          paddingTop: '8px', 
          paddingBottom: '8px' 
        }}>
          {params.value}
        </Box>
      ),
    },
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
      const response = await axios.get("http://localhost:8005/api/v1/weapons");
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
      await axios.delete(`http://localhost:8005/api/v1/weapons/${id}`);
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
      <Paper sx={{ 
          overflow: 'auto', // Enables scrolling if content overflows
          maxHeight: 'calc(100vh - 100px)', // Sets a maximum height based on the viewport height minus 100px
          width: '80%', // Sets the width to 80% of the parent container
          maxWidth: '1200px', // Sets a maximum fixed width for the Paper component
          margin: '0 auto', // Centers the Paper horizontally
        }}>
        <DataGrid
            columns={columns} // The columns that you already have defined
            rows={rows} // The data that you already have
            getRowId={(row) => row._id} // Unique identifier for each row, based on _id
            autoHeight // Automatically adjusts the row height based on content
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 }, // Default page and page size
              },
            }}
            pageSizeOptions={[5, 10]} // Options for the pagination to choose page sizes
            components={{
              ColumnHeader: () => null, // Customizes the column header, here it hides it
            }}
            getRowHeight={() => 'auto'} // Allows the row height to be auto-adjusted based on content
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
