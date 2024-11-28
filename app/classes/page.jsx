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
import ClassDialog from "./components/classDialog";
import Alerts from "../components/alerts";

// React hooks for state management
import { useState, useEffect } from "react";

// Axios for making HTTP requests to the backend
import axios from "axios";

export default function Classes() {
  // Define columns for the DataGrid table
  const columns = [
    { field: "_id", headerName: "ID", width: 30 },
    { field: "role", headerName: "Class", flex: 2 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "hd", headerName: "Hit Die", flex: 1 },
    { field: "pa", headerName: "Primary Ability", flex: 1 },
    { field: "stp", headerName: "Saving Throw Proficiencies", flex: 1 },
    { field: "awp", headerName: "Armor and Weapon Proficiencies", flex: 1 },
    // Commented out extra field
    // { field: "extra", headerName: "Extra", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box>
          {/* Edit button */}
          <IconButton
            color="primary"
            onClick={() => handleClass({ action: "edit", classData: params.row })}
          >
            <AutoFixHighIcon />
          </IconButton>
          {/* Delete button */}
          <IconButton
            color="secondary"
            onClick={() => deleteClass(params.row._id)}
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
  const [classData, setClass] = useState({
    id: null,
    role: "",
    description: "",
    hd: "",
    pa: "",
    stp: "",
    awp: "",
    // extra: ""
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
        // extra: ""
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
    <Container maxWidth="xl" disableGutters>
      {/* Button to add a new class */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
        <Button
          startIcon={<AddCircleIcon />}
          variant="contained"
          sx={{ borderRadius: 3 }}
          onClick={() => handleClass({ action: "add" })}
        >
          Add Class
        </Button>
      </Box>

      {/* DataGrid table for displaying classes */}
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
          sx={{
            border: "1px solid #DDD", // Border for the table
            backgroundColor: "#F9F9F9", // Table background color
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold", // Bold headers
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid #DDD", // Divider between headers and rows
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#F5F5F5", // Hover effect on rows
            },
            "& .MuiDataGrid-cell": {
              borderRight: "1px solid #DDD", // Divider between cells
              color: "black", // Text color for cells
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#F1F1F1", // Footer background color
            },
          }}
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
  );
}
