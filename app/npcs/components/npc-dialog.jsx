import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useEffect, useState } from "react";

// This component handles showing the dialog for adding, editing, or viewing a NPC
export default function NpcDialog({
  open,          // Boolean to control dialog visibility
  setOpen,       // Function to set dialog visibility
  npcData,       // State to hold the current NPC data
  setNpc,        // Function to update npcData state
  action,        // Current action ("add", "edit", "view")
  npcCards,      // List of current NPC cards
  setNpcCards,   // Function to update the list of NPC cards
  setAlert,      // Function to set alert messages
  setOpenAlert,   // Function to control alert visibility
  setVisible
}) {

  // Close the dialog when the user clicks cancel or closes it
  const handleCloseDialog = () => {
    setOpen(false); // Close the dialog
  };
  
  const [randomMessage, setRandomMessage] = useState("");
  const randomMessages = [
    "The arcane ritual is incomplete! Fill in every rune to summon your NPC.",
    "The weave rejects your creation. Ensure all elements are in place for your NPC to rise.",
    "Your incantation falters! Fill every field, or the magic will fade into the void",
    "The gods demand more! Every piece of the puzzle must be set for your NPC to awaken.",
    "The summoning circle flickers. Complete the runes to ensure their arrival.",
    "Incomplete spells yield incomplete souls. Finish the chant to craft your NPC.",
    "The tome of creation remains unfinished. Inscribe all details to bring your NPC to life.",
    "Without all the required sigils, the NPC is but a fleeting shadow.",
    "The essence of the NPC is scattered. Only you can unite it by completing all fields.",
    "The gods grow impatient! Grant your NPC the details they deserve.",
    "Your NPC waits in the void. Finish the ritual and give them life."
  ];

  const RandomPick = () => {
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    setRandomMessage(randomMessages[randomIndex]);
  }
  useEffect(() => {
    RandomPick();
  }, []);

  // Save the npc data based on whether it's an "add" or "edit" action
  const saveNpc = async () => {
    if (action === "add") { // If the action is "add"
      try {
        const response = await axios.post("http://localhost:8004/api/v1/npcs", npcData); // Send data to the server to add the npc
        setNpcCards((prevNpcCards) => {
          const newNpcCards = [...prevNpcCards, response.data]; // Add the new npc to the list 
          setVisible((prevVisible) => [...prevVisible, newNpcCards.length - 1]); // Animate the new npc 
          return newNpcCards; });
        setAlert({
          message: "Behold! Your creation is alive", // Success message
          severity: "success", // Set the message severity as success
        });
        setOpenAlert(true);
        handleCloseDialog();
      } catch (error) {
        if (error.response.status) {
          switch (error.response.status) {
            case 400:
              setAlert({
                message: randomMessage, // Error message
                severity: "error", // Set the message severity as error
              });
              break;
            default:
              setAlert({
                message: randomMessage, // Error message
                severity: "error", // Set the message severity as error
              });
              break;
           }
        } else {
          setAlert({
            message: randomMessage, // Error message
            severity: "error" + error, // Set the message severity as error
          });
        }
      }
      setOpenAlert(true); // Show the alert
      RandomPick();
    } else if (action === "edit") { // If the action is "edit"
      try {
        const response = await axios.put(`http://localhost:8004/api/v1/npcs/${npcData._id}`, npcData); // Update npc on the server
        setNpcCards(npcCards.map((row) => (row._id === npcData._id ? response.data : row))); // Update the npc in the list
        setAlert({
          message: "The scrolls of destiny have been rewritten. Your NPC is now reborn!", // Success message
          severity: "success", // Set the message severity as success
        });
        setOpenAlert(true); // Show the alert
        handleCloseDialog(); // Close the dialog after saving
      } catch (error) {
        if (error.response.status) {
          switch (error.response.status) {
            case 400:
              setAlert({
                message: randomMessage, // Error message
                severity: "error", // Set the message severity as error
              });
              break;
            default:
              setAlert({
                message: "Failed to edit NPC", // Error message
                severity: "error", // Set the message severity as error
              });
              break;
          }
        } else {
          setAlert({
            message: "Server Error: " + error, // Error message
            severity: "error", // Set the message severity as error
          });
        }
      }
      setOpenAlert(true); // Show the alert
      RandomPick();
    }
    //handleCloseDialog(); // Close the dialog after saving
  };

  // Handle changes in the input fields and update the npcData state
  const handleChange = (event) => {
    setNpc({
      ...npcData, // Keep the current npc data and update only the changed field
      [event.target.name]: event.target.value || "", // Set the new value for the specific field
    });
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle
        style={{ textAlign: "center", fontWeight: "bold", fontSize: "2rem" }}>
       {action === "add" ? "Create NPC" : action === "edit" ? "Reshape NPC" : "NPC Details"}</DialogTitle>
      <DialogContent>
        {/* Render input fields or typography based on action */}
        {action === "view" ? (
          <>
            <Typography variant="body1"><strong>Name:</strong> {npcData.named}</Typography>
            <Typography variant="body1"><strong>Role:</strong> {npcData.role}</Typography>
            <Typography variant="body1"><strong>Personality:</strong> {npcData.personality}</Typography>
            <Typography variant="body1"><strong>Likes:</strong> {npcData.likes}</Typography>
            <Typography variant="body1"><strong>Inventory:</strong> {npcData.inventory}</Typography>
            <Typography variant="body1"><strong>Money:</strong> {npcData.money}</Typography>
            <Typography variant="body1"><strong>Backstory:</strong> {npcData.backstory}</Typography>
          </>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                margin="dense"
                size="small"
                name="named"
                label="Name"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={npcData.named}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                margin="dense"
                size="small"
                name="role"
                label="Role"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={npcData.role}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                margin="dense"
                size="small"
                name="picture"
                label="Picture URL"
                fullWidth
                value={npcData.picture || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                name="personality"
                label="Personality"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={npcData.personality}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                name="likes"
                label="Likes"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={npcData.likes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                name="inventory"
                label="Inventory"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={npcData.inventory}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                name="money"
                label="Money"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={npcData.money}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="backstory"
                label="Backstory"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={npcData.backstory}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleCloseDialog}>
          Close
        </Button>
        {action !== "view" && (
          <Button variant="outlined" color="primary" onClick={saveNpc}>
            {action === "add" ? "Add" : "Edit"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

