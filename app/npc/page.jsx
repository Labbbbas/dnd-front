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
import NpcDialog from "./components/npc-dialog";
import Alerts from "../components/alerts";

// React hooks for state management
import { useState, useEffect } from "react";

// Axios for making HTTP requests to the backend
import axios from "axios";

export default function Npcs() {
  // Define columns for the DataGrid table
  const columns = [
    { field: "_id", headerName: "ID", width: 10 },
    { field: "named", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "personality", headerName: "Personality", flex: 1 },
    { field: "likes", headerName: "Likes", flex: 1 },
    { field: "inventory", headerName: "Inventory", flex: 1 },
    { field: "money", headerName: "Money", flex: 1 },
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
            onClick={() => handleNpc({ action: "edit", npcData: params.row })}
          >
            <AutoFixHighIcon />
          </IconButton>
          {/* Delete button */}
          <IconButton
            color="secondary"
            onClick={() => deleteNpc(params.row._id)}
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
  const [npcData, setNpc] = useState({
    id: null,
    named: "",
    role: "",
    personality: "",
    inventory: "",
    likes: "",
    money: "",
    // extra: ""
  }); // Npc data to be added or edited

  // Fetch the npcs from the server when the component is mounted
  useEffect(() => {
    fetchNpcs();
  }, []); // Empty dependency array means it runs only once when the component mounts

  // Fetch the list of npcs from the backend
  const fetchNpcs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/npcs");
      setRows(response.data); // Set the fetched npcs to the state
    } catch (error) {
      console.error("Error fetching npcs", error);
      // Display an alert if there is an error
      setAlert({
        message: "Failed to load npcs",
        severity: "error",
      });
      setOpenAlert(true); // Open the alert
    }
  };

  // Handle the npc actions (add or edit)
  const handleNpc = ({ action, npcData }) => {
    console.info("Handle npc action:", action);
    setAction(action); // Set the current action (add/edit)
    setOpenDialog(true); // Open the dialog
    // If adding a npc, clear the form fields
    if (action === "add") {
      setNpc({
        id: null,
        named: "",
        role: "",
        personality: "",
        inventory: "",
        likes: "",
        money: "",
        // extra: ""
      });
    } else if (action === "edit") {
      setNpc(npcData); // If editing, load the npc data into the form
    } else {
      console.warn("Unknown action:", action);
    }
  };

  // Delete a npc from the database
  const deleteNpc = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/v1/npcs/${id}`);
      setRows(rows.filter((row) => row._id !== id)); // Remove the deleted npc from the table
      setAlert({
        message: "Npc deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting npc: ", error);
      setAlert({
        message: "Failed to delete npc",
        severity: "error",
      });
    }
    setOpenAlert(true); // Open the alert with success or error message
  };

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Button to add a new npc */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
        <Button
          startIcon={<AddCircleIcon />}
          variant="contained"
          sx={{ borderRadius: 3 }}
          onClick={() => handleNpc({ action: "add" })}
        >
          Add NPC
        </Button>
      </Box>

      {/* DataGrid table for displaying npcs */}
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

      {/* Dialog for adding or editing a npc */}
      <NpcDialog
        open={openDialog}
        setOpen={setOpenDialog}
        npcData={npcData}
        setNpc={setNpc}
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
