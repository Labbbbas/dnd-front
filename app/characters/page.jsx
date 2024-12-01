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
import CharacterDialog from "./components/character_dialog";
import Alerts from "../components/alerts";

// React hooks for state management
import { useState, useEffect } from "react";

// Axios for making HTTP requests to the backend
import axios from "axios";

export default function Characters() {
  // Define columns for the DataGrid table
  // Each column has an appropriate width and flex to make it look aesthetic
  const columns = [
    {
      field: "characterName", 
      headerName: "Character",
      flex: 3,
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center",
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Character
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
      field: "race", 
      headerName: "Race", 
      flex: 2, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "left", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Race
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
      field: "className", 
      headerName: "Class", 
      width: 70, 
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
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "alignment", 
      headerName: "Alignment", 
      width: 160, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Alignment
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "level", 
      headerName: "Level", 
      width: 210, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "center", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Level
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "background", 
      headerName: "Background", 
      width: 180, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "justify", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Background
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
      field: "playerName", 
      headerName: "Player Name", 
      width: 150, 
      sortable: false, // Disable sorting
      disableColumnMenu: true, // Disable column menu
      headerAlign: "center", 
      align: "justify", 
      renderHeader: () => (
        <Box sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Player Name
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
          <IconButton color="primary" onClick={() => handleCharacter({ action: "edit", characterData: params.row })}>
            <AutoFixHighIcon />
          </IconButton>
          {/* Delete button */}
          <IconButton color="secondary" onClick={() => deleteCharacter(params.row._id)}>
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
  const [characterData, setCharacter] = useState({
    id: null,
    characterName: "",
    race: "",
    className: "",
    alignment: "",
    level: "",
    background: "",
    playerName: ""
  }); // Character data to be added or edited

  // Fetch the characters from the server when the component is mounted
  useEffect(() => {
    fetchCharacters();
  }, []); // Empty dependency array means it runs only once when the component mounts

  // Fetch the list of characters from the backend
  const fetchCharacters = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/characters");
      setRows(response.data); // Set the fetched characters to the state
    } catch (error) {
      //console.error("Error fetching characters", error);
      // Display an alert if there is an error
      setAlert({
        message: "Failed to load characters",
        severity: "error",
      });
      setOpenAlert(true); // Open the alert
    }
  };

  // Handle the character actions (add or edit)
  const handleCharacter = ({ action, characterData }) => {
    console.info("Handle character action:", action);
    setAction(action); // Set the current action (add/edit)
    setOpenDialog(true); // Open the dialog
    // If adding a character, clear the form fields
    if (action === "add") {
      setCharacter({
        id: null,
        characterName: "",
        race: "",
        className: "",
        alignment: "",
        level: "",
        background: "",
        playerName: ""
      });
    } else if (action === "edit") {
      setCharacter(characterData); // If editing, load the character data into the form
    } else {
      console.warn("Unknown action:", action);
    }
  };

  // Random messages for fun when deleting a character
  const randDeleteMessage = () => {
    const messages = [
      "The wizard’s scrolls vanish in a puff of arcane smoke. The character has been erased from existence!",
      "The rogue has disarmed the trap... and the character! It's gone forever.",
      "The bard sang a mournful tune. The character has been deleted.",
      "The barbarian smashed the table! This character is no more.",
      "The cleric cast Banish. The character has been sent to another plane.",
      "The ranger tracked the character to the void. It will trouble you no more.",
      "The paladin judged this character unworthy. Smited and deleted!",
      "The warlock's pact ends here. This character is obliterated!",
      "The dungeon master declares: The character is no longer canon!",
      "The druid transforms it into... nothingness. Character deleted!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Delete a character from the database
  const deleteCharacter = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/v1/characters/${id}`);
      setRows(rows.filter((row) => row._id !== id)); // Remove the deleted character from the table
      setAlert({
        message: randDeleteMessage(), // Random message for fun
        severity: "success",
      });
    } catch (error) {
      //console.error("Error deleting character: ", error);
      setAlert({
        message: "Failed to delete character",
        severity: "error",
      });
    }
    setOpenAlert(true); // Open the alert with success or error message
  };

  return (
    <Box sx={{ minHeight: '100vh', paddingBottom: '50px' }}> {/* Add a blank space in the bottom */}
      <Container maxWidth="xl" disableGutters>
        {/* Button to add a new character */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
          <Button
            startIcon={<AddCircleIcon />}
            variant="contained"
            sx={{ borderRadius: 3 }}
            onClick={() => handleCharacter({ action: "add" })}
          >
            Create Character
          </Button>
        </Box>

        {/* DataGrid table for displaying characters */}
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


        {/* Dialog for adding or editing a character */}
        <CharacterDialog
          open={openDialog}
          setOpen={setOpenDialog}
          characterData={characterData}
          setCharacter={setCharacter}
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