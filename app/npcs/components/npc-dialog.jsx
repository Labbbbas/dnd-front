import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";

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
  setOpenAlert   // Function to control alert visibility
}) {

  // Close the dialog when the user clicks cancel or closes it
  const handleCloseDialog = () => {
    setOpen(false); // Close the dialog
  };

  // Save the npc data based on whether it's an "add" or "edit" action
  const saveNpc = async () => {
    if (action === "add") { // If the action is "add"
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/v1/npcs", npcData); // Send data to the server to add the npc
        setNpcCards([...npcCards, response.data]); // Add the new npc to the list
        setAlert({
          message: "Npc added successfully", // Success message
          severity: "success", // Set the message severity as success
        });
      } catch (error) {
        setAlert({
          message: "Failed to add NPC", // Error message
          severity: "error", // Set the message severity as error
        });
      }
      setOpenAlert(true); // Show the alert

    } else if (action === "edit") { // If the action is "edit"
      try {
        const response = await axios.put(`http://127.0.0.1:5000/api/v1/npcs/${npcData._id}`, npcData); // Update npc on the server
        setNpcCards(npcCards.map((row) => (row._id === npcData._id ? response.data : row))); // Update the npc in the list
        setAlert({
          message: "Npc updated successfully", // Success message
          severity: "success", // Set the message severity as success
        });
      } catch (error) {
        setAlert({
          message: "Failed to update npc", // Error message
          severity: "error", // Set the message severity as error
        });
      }
      setOpenAlert(true); // Show the alert
    }
    handleCloseDialog(); // Close the dialog after saving
  };

  // Handle changes in the input fields and update the npcData state
  const handleChange = (event) => {
    setNpc({
      ...npcData, // Keep the current npc data and update only the changed field
      [event.target.name]: event.target.value, // Set the new value for the specific field
    });
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle alignSelf={"center"}>{action === "add" ? "Add NPC" : action === "edit" ? "Edit NPC" : "NPC Details"}</DialogTitle>
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
          </>
        ) : (
          <>
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
            <TextField
              margin="dense"
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
            <TextField
              margin="dense"
              name="likes"
              label="Likes"
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              value={npcData.likes}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="inventory"
              label="Inventory"
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              value={npcData.inventory}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
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
          </>
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

