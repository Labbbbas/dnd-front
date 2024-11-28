import {
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";

// This component handles showing the dialog for adding or editing a class
export default function ClassDialog({
  open,
  setOpen,
  classData,
  setClass,
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

  // Save the class data based on whether it's an "add" or "edit" action
  const saveClass = async () => {
    if (action == "add") { // If the action is "add"
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/v1/classes", classData); // Send data to the server to add the class
        setRows([...rows, response.data]); // Add the new class to the rows
        setAlert({
          message: "Class added successfully", // Success message
          severity: "success", // Set the message severity as success
        });
      } catch (error) {
        console.error("Error adding class: ", error);
        setAlert({
          message: "Failed to add class", // Error message
          severity: "error", // Set the message severity as error
        });
      }
      setOpenAlert(true); // Show the alert

    } else if (action === "edit") { // If the action is "edit"
      try {
        const response = await axios.put(`http://127.0.0.1:5000/api/v1/classes/${classData._id}`, classData); // Update class on the server
        setRows(rows.map((row) => (row._id === classData._id ? response.data : row))); // Update the class in the rows list
        setAlert({
          message: "Class updated successfully", // Success message
          severity: "success", // Set the message severity as success
        });
      } catch (error) {
        setAlert({
          message: "Failed to update class", // Error message
          severity: "error", // Set the message severity as error
        });
      }
      setOpenAlert(true); // Show the alert
    }
    handleCloseDialog(); // Close the dialog after saving
  };

  // Handle changes in the input fields and update the classData state
  const handleChange = (event) => {
    setClass({
      ...classData, // Keep the current class data and update only the changed field
      [event.target.name]: event.target.value, // Set the new value for the specific field
    });
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}> {/* Show the dialog */}
      <DialogTitle> {action === "add" ? "Add Class" : "Edit Class"} </DialogTitle>
      <DialogContent>
        {/* Input fields for class details */}
        <TextField
          margin="dense"
          name="role"
          label="Role"
          fullWidth
          value={classData.role}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          value={classData.description}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          name="hd"
          label="Hit Die"
          fullWidth
          value={classData.hd}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          name="pa"
          label="Primary Ability"
          fullWidth
          value={classData.pa}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          name="stp"
          label="Saving Throw Proficiencies"
          fullWidth
          value={classData.stp}
          onChange={handleChange} // Call handleChange on input change
        />
        <TextField
          margin="dense"
          name="awp"
          label="Armor and Weapon Proficiencies"
          fullWidth
          value={classData.awp}
          onChange={handleChange} // Call handleChange on input change
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleCloseDialog}> 
          {" "} Cancel{" "} {/* Cancel button to close the dialog */}
        </Button>
        <Button color="primary" onClick={saveClass}>
          {action === "add" ? "Add" : "Edit"} {/* Show "Add" or "Edit" depending on the action */}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
