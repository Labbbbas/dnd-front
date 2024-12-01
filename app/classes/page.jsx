"use client";

// Import necessary Material UI components for layout and UI elements
import { Box, Button, Container, IconButton, Paper } from "@mui/material";

// Import icons for actions like editing and deleting
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Import DataGrid component for displaying data in a table
import { DataGrid } from "@mui/x-data-grid";

// Import custom components for dialogs and alerts
import ClassDialog from "./components/class-dialog";
import Alerts from "../components/alerts";

// React hooks for state management
import { useState, useEffect } from "react";

// Axios for making HTTP requests to the backend
import axios from "axios";

export default function Classes() {
  // Define columns for the DataGrid table
  // Each column has an appropriate width and flex to make it look aesthetic
  const columns = [
    {
      field: "role", 
      headerName: "Class",
      flex: 1,
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center",
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Class
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
      field: "description", 
      headerName: "Description", 
      flex: 2, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "left", 
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
      field: "hd", 
      headerName: "Hit Die", 
      width: 70, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center",
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Hit Die
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "pa", 
      headerName: "Primary Ability", 
      width: 160, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Primary Ability
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "stp", 
      headerName: "Saving Throw Proficiencies", 
      width: 200, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Saving Throw Proficiencies
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "awp", 
      headerName: "Armor and Weapon Proficiencies", 
      width: 240, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "justify", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Armor and Weapon Proficiencies
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
      field: "actions", 
      headerName: "", 
      width: 120,
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {/* Edit button */}
          <IconButton color="primary" onClick={() => handleClass({ action: "edit", classData: params.row })}>
            <AutoFixHighIcon />
          </IconButton>
          {/* Delete button */}
          <IconButton color="secondary" onClick={() => deleteClass(params.row._id)}>
            <WhatshotIcon />
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
  const [classData, setClass] = useState({
    id: null,
    role: "",
    description: "",
    hd: "",
    pa: "",
    stp: "",
    awp: "",
  }); // Class data to be added or edited

  // Fetch the classes from the server when the component is mounted
  useEffect(() => {
    fetchClasses();
  }, []); // Empty dependency array means it runs only once when the component mounts

  // Fetch the list of classes from the backend
  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/classes");
      setRows(response.data); // Set the fetched classes to the state
    } catch (error) {
      console.error("Error fetching classes", error);
      // Display an alert if there is an error
      setAlert({
        message: "Failed to load classes",
        severity: "error",
      });
      setOpenAlert(true); // Open the alert
    }
  };

  // Handle the class actions (add or edit)
  const handleClass = ({ action, classData }) => {
    console.info("Handle class action:", action);
    setAction(action); // Set the current action (add/edit)
    setOpenDialog(true); // Open the dialog
    // If adding a class, clear the form fields
    if (action === "add") {
      setClass({
        id: null,
        role: "",
        description: "",
        hd: "",
        pa: "",
        stp: "",
        awp: "",
      });
    } else if (action === "edit") {
      setClass(classData); // If editing, load the class data into the form
    } else {
      console.warn("Unknown action:", action);
    }
  };

  // Delete a class from the database
  const deleteClass = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/v1/classes/${id}`);
      setRows(rows.filter((row) => row._id !== id)); // Remove the deleted class from the table
      setAlert({
        message: "Class deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting class: ", error);
      setAlert({
        message: "Failed to delete class",
        severity: "error",
      });
    }
    setOpenAlert(true); // Open the alert with success or error message
  };

  return (
    <Box sx={{ minHeight: '100vh', paddingBottom: '50px' }}> {/* Add a blank space in the bottom */}
      <Container maxWidth="xl" disableGutters>
        {/* Button to add a new class */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
          <Button
            startIcon={<AddCircleIcon />}
            variant="contained"
            sx={{ borderRadius: 3 }}
            onClick={() => handleClass({ action: "add" })}
          >
            Create Class
          </Button>
        </Box>

        {/* DataGrid table for displaying classes */}
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


        {/* Dialog for adding or editing a class */}
        <ClassDialog
          open={openDialog}
          setOpen={setOpenDialog}
          classData={classData}
          setClass={setClass}
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
    </Box>
  );
}
