import {
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";

// This component handles showing the dialog for adding or editing a npc
export default function NpcDialog({
  open,
  setOpen,
  npcData,
  setNpc,
  action,
  rows,
  setRows,
  setAlert,
  setOpenAlert,
}) {
  
  // Close the dialog when the user clicks cancel or closes it
  const handleCloseDialog = () => {
    setOpen(false); // Close the dialog
  };

  // Save the npc data based on whether it's an "add" or "edit" action
  const saveNpc = async () => {
    if (action == "add") { // If the action is "add"
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/v1/npcs", npcData); // Send data to the server to add the npc
        setRows([...rows, response.data]); // Add the new npc to the rows
        setAlert({
          message: "Npc added successfully", // Success message
          severity: "success", // Set the message severity as success
        });
      } catch (error) {
        console.error("Error adding npc: ", error);
        setAlert({
          message: "Failed to add NPC", // Error message
          severity: "error", // Set the message severity as error
        });
      }
      setOpenAlert(true); // Show the alert

    } else if (action === "edit") { // If the action is "edit"
      try {
        const response = await axios.put(`http://127.0.0.1:5000/api/v1/npcs/${npcData._id}`, npcData); // Update npc on the server
        setRows(rows.map((row) => (row._id === npcData._id ? response.data : row))); // Update the npc in the rows list
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
    <Dialog open={open} onClose={handleCloseDialog}> {/* Show the dialog */}
      <DialogTitle alignSelf={"center"}> {action === "add" ? "Add NPC" : "Edit NPC"} </DialogTitle>
      <DialogContent>
        {/* Input fields for npc details */}
        <TextField
          margin="dense"
          size="small"
          name="named"
          label="Name"
          sx={{ width: "50%" }}
          value={npcData.named}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          size="small"
          name="role"
          label="Role"
          sx={{ width: "50%" }}
          value={npcData.role}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          size="small"
          name="personality"
          label="Personality"
          fullWidth
          value={npcData.personality}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          name="likes"
          label="Likes"
          fullWidth
          value={npcData.likes}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          name="inventory"
          label="Inventory"
          fullWidth
          value={npcData.inventory}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          size="small"
          name="money"
          label="Money"
          fullWidth
          value={npcData.money}
          onChange={handleChange} // Call handleChange on input change
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleCloseDialog}> 
          {" "} Cancel{" "} {/* Cancel button to close the dialog */}
        </Button>
        <Button variant="outlined" color="primary" onClick={saveNpc}>
          {action === "add" ? "Add" : "Edit"} {/* Show "Add" or "Edit" depending on the action */}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
