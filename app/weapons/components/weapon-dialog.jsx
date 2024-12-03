import {
    Dialog,
    TextField,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
  } from "@mui/material";
  import axios from "axios";
  
  // This component handles showing the dialog for adding or editing a weapon
  export default function WeaponDialog({
    open,
    setOpen,
    weaponData,
    setWeapon,
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
  
    // Save the weapon data based on whether it's an "add" or "edit" action
    const saveWeapon = async () => {
      if (action == "add") { // If the action is "add"
        try {
          const response = await axios.post("http://localhost:8005/api/v1/weapons", weaponData); // Send data to the server to add the weapon
          setRows([...rows, response.data]); // Add the new weapon to the rows
          setAlert({
            message: "Weapon added successfully", // Success message
            severity: "success", // Set the message severity as success
          });
        } catch (error) {
          //console.error("Error adding weapon: ", error);
          setAlert({
            message: "Failed to add weapon", // Error message
            severity: "error", // Set the message severity as error
          });
        }
        setOpenAlert(true); // Show the alert
  
      } else if (action === "edit") { // If the action is "edit"
        try {
          const response = await axios.put(`http://localhost:8005/api/v1/weapons/${weaponData._id}`, weaponData); // Update weapon on the server
          setRows(rows.map((row) => (row._id === weaponData._id ? response.data : row))); // Update the weapon in the rows list
          setAlert({
            message: "Weapon updated successfully", // Success message
            severity: "success", // Set the message severity as success
          });
        } catch (error) {
          setAlert({
            message: "Failed to update weapon", // Error message
            severity: "error", // Set the message severity as error
          });
        }
        setOpenAlert(true); // Show the alert
      }
      handleCloseDialog(); // Close the dialog after saving
    };
  
    // Handle changes in the input fields and update the weaponData state
    const handleChange = (event) => {
      setWeapon({
        ...weaponData, // Keep the current weapon data and update only the changed field
        [event.target.name]: event.target.value, // Set the new value for the specific field
      });
    };
  
    return (
      <Dialog open={open} onClose={handleCloseDialog}> {/* Show the dialog */}
        <DialogTitle> {action === "add" ? "Add Weapon" : "Edit Weapon"} </DialogTitle>
        <DialogContent>
          {/* Input fields for weapon details */}
          <TextField
            margin="dense"
            name="named"
            label="Name"
            fullWidth
            value={weaponData.named}
            onChange={handleChange} // Call handleChange on input change
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            fullWidth
            value={weaponData.category}
            onChange={handleChange} // Call handleChange on input change
          />
          <TextField
            margin="dense"
            name="cost"
            label="Cost"
            fullWidth
            value={weaponData.cost}
            onChange={handleChange} // Call handleChange on input change
          />
          <TextField
            margin="dense"
            name="damage"
            label="Damage"
            fullWidth
            value={weaponData.damage}
            onChange={handleChange} // Call handleChange on input change
          />
          <TextField
            margin="dense"
            name="properties"
            label="Properties"
            fullWidth
            value={weaponData.properties}
            onChange={handleChange} // Call handleChange on input change
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            value={weaponData.description}
            onChange={handleChange} // Call handleChange on input change
          />
          <TextField
            margin="dense"
            name="weight"
            label="Weight"
            fullWidth
            value={weaponData.weight}
            onChange={handleChange} // Call handleChange on input change
            />
        </DialogContent>
        <DialogActions>
          <Button variant= "outlined" color="secondary" onClick={handleCloseDialog}> 
            {" "} Cancel{" "} {/* Cancel button to close the dialog */}
          </Button>
          <Button variant= "outlined" color="primary" onClick={saveWeapon}>
            {action === "add" ? "Add" : "Edit"} {/* Show "Add" or "Edit" depending on the action */}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  