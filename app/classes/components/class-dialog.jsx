import {
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Box,
  Typography,
  Grid,
  FormHelperText
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

  // Convert string to array for primary ability (on edit)
  const normalizePrimaryAbility = (pa) => {
    return Array.isArray(pa) ? pa : pa.split(", ").filter(Boolean);
  };

  // Convert string to array for saving throw proficiencies (on edit)
  const normalizeSavingThrowProficiencies = (stp) => {
    return Array.isArray(stp) ? stp : stp.split(", ").filter(Boolean);
  };

  // Normalize classData on initial load or when editing
  const normalizedClassData = {
    ...classData,
    pa: normalizePrimaryAbility(classData.pa || []), // Normalize primary ability
    stp: normalizeSavingThrowProficiencies(classData.stp || []), // Normalize saving throw proficiencies
  };

  // Save the class data based on whether it's an "add" or "edit" action
  const saveClass = async () => {
    // // Check if any required field is empty
    // if (!normalizedClassData.role || !normalizedClassData.description || normalizedClassData.pa.length === 0 || normalizedClassData.stp.length === 0) {
    //   // If any field is empty, show an error message
    //   setAlert({
    //     message: "All fields are required. Please fill in all the fields.",
    //     severity: "error",
    //   });
    //   setOpenAlert(true); // Show the alert
    //   return; // Do not proceed with saving if there are empty fields
    // }

    const classDataToSend = {
      ...normalizedClassData,
      pa: normalizedClassData.pa.join(", "), // Convert array to string when sending data
      stp: normalizedClassData.stp.join(", "), // Convert array to string when sending data
    };

    if (action === "add") { // If the action is "add"
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/v1/classes", classDataToSend); // Send data to the server to add the class
        setRows([...rows, response.data]); // Add the new class to the rows
        setAlert({
          message: "Class added successfully", // Success message
          severity: "success", // Set the message severity as success
        });
      } catch (error) {
        // console.error("Error adding classes", error);
        setAlert({
          message: "Failed to add class", // Error message
          severity: "error", // Set the message severity as error
        });
      }
      setOpenAlert(true); // Show the alert

    } else if (action === "edit") { // If the action is "edit"
      try {
        const response = await axios.put(`http://127.0.0.1:5000/api/v1/classes/${classData._id}`, classDataToSend); // Update class on the server
        setRows(rows.map((row) => (row._id === classData._id ? response.data : row))); // Update the class in the rows list
        setAlert({
          message: "Class updated successfully", // Success message
          severity: "success", // Set the message severity as success
        });
      } catch (error) {
        // console.error("Error updating classes", error);
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
      ...normalizedClassData, // Keep the current class data and update only the changed field
      [event.target.name]: event.target.value, // Set the new value for the specific field
    });
  };

  // Handle changes for multiple selections (Primary Ability)
  const handlePrimaryAbilityChange = (event) => {
    const { value } = event.target;
    if (value.length <= 2) {
      setClass({
        ...normalizedClassData,
        pa: value, // Keep the value as an array
      });
    }
  };

    // Handle changes for multiple selections (Saving Throw Proficiencies)
    const handleSavingThrowProficienciesChange = (event) => {
      const { value } = event.target;
      if (value.length <= 2) {
        setClass({
          ...normalizedClassData,
          stp: value, // Keep the value as an array
        });
      }
    };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseDialog}
      sx={{ 
        '& .MuiDialog-paper': {
          width: '80%', // Set the width to 80% of the parent container
          maxWidth: '800px', // Set a fixed maximum width
        },
      }}
    > 
      {/* Show the dialog */}
      <DialogTitle style={{ textAlign: "center", fontWeight: "bold", fontSize: "2rem" }}>
        {/* Dialog title changes based on whether we're adding or editing a class */}
        {action === "add" ? "Create Class" : "Edit Class"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} justifyContent="center">
          
          {/* Role input field */}
          <Grid item xs={12} sm={6} container justifyContent="center">
            <TextField
              margin="dense" // Adds margin around the text field
              name="role" // The name of the field for easy identification
              label="Class" // Label to be displayed in the field
              fullWidth // Makes the text field take the full width of its container
              value={normalizedClassData.role} // The current value of the "role" field
              onChange={handleChange} // Event handler that updates the state when the input changes
            />
          </Grid>

          {/* Description input field */}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="description"
              label="Description"
              fullWidth
              value={normalizedClassData.description}
              onChange={handleChange} // Updates the state when the description changes
            />
          </Grid>

          {/* Hit Die, Primary Ability, and Saving Throw Proficiencies in the same row */}
          <Grid container item xs={12} spacing={2}>
            
            {/* Hit Die selection field */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Hit Die</InputLabel> {/* Label for the input */}
                <Select
                  name="hd" // Name of the field
                  value={normalizedClassData.hd} // The current value of the "hit die"
                  onChange={handleChange} // Updates the state when the hit die changes
                  label="Hit Die"
                >
                  {/* Menu items for the available hit die options */}
                  <MenuItem value="d6">d6</MenuItem>
                  <MenuItem value="d8">d8</MenuItem>
                  <MenuItem value="d10">d10</MenuItem>
                  <MenuItem value="d12">d12</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Primary Ability selection field (multiple options) */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Primary Ability</InputLabel>
                <Select
                  multiple // Allows multiple selections for primary abilities
                  name="pa" // The name of the field for easy identification
                  value={normalizedClassData.pa || []} // The selected primary abilities
                  onChange={handlePrimaryAbilityChange} // Event handler for when the primary abilities change
                  label="Primary Ability"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {/* Displays the selected abilities as chips */}
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {/* Available primary abilities */}
                  <MenuItem value="Strength">Strength</MenuItem>
                  <MenuItem value="Charisma">Charisma</MenuItem>
                  <MenuItem value="Wisdom">Wisdom</MenuItem>
                  <MenuItem value="Dexterity">Dexterity</MenuItem>
                  <MenuItem value="Intelligence">Intelligence</MenuItem>
                </Select>
                <FormHelperText>Select 1 or 2 abilities</FormHelperText>
              </FormControl>
            </Grid>

            {/* Saving Throw Proficiencies selection field (multiple options) */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Saving Throw Proficiencies</InputLabel>
                <Select
                  multiple // Allows multiple selections for saving throw proficiencies
                  name="stp" // The name of the field for easy identification
                  value={normalizedClassData.stp || []} // The selected saving throw proficiencies
                  onChange={handleSavingThrowProficienciesChange} // Event handler for when the proficiencies change
                  label="Saving Throw Proficiencies"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {/* Displays the selected proficiencies as chips */}
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {/* Available saving throw proficiencies */}
                  <MenuItem value="Strength">Strength</MenuItem>
                  <MenuItem value="Charisma">Charisma</MenuItem>
                  <MenuItem value="Wisdom">Wisdom</MenuItem>
                  <MenuItem value="Dexterity">Dexterity</MenuItem>
                  <MenuItem value="Intelligence">Intelligence</MenuItem>
                  <MenuItem value="Constitution">Constitution</MenuItem>
                </Select>
                <FormHelperText>Select 2 Saving Throw Proficiencies</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          {/* Armor and Weapon Proficiencies input field */}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="awp"
              label="Armor and Weapon Proficiencies"
              fullWidth
              value={normalizedClassData.awp} // The current value of the armor and weapon proficiencies field
              onChange={handleChange} // Event handler for when the field changes
            />
          </Grid>
        </Grid>

        {/* Error message to indicate all fields are required */}
        <Typography variant="h6" align="center" color="error" mt={2}>
          All fields are required
        </Typography>
      </DialogContent>

      {/* Dialog Actions (buttons for Cancel and Save) */}
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}> {/*gap property adds spacing between the buttons*/}
        {/* Cancel button */}
        <Button 
          variant="outlined" // Button style (outlined)
          color="secondary" // Button color (secondary)
          onClick={handleCloseDialog} // Event handler to close the dialog
        >
          Cancel
        </Button>
        
        {/* Save button (Add or Edit depending on the action) */}
        <Button 
          variant="outlined" // Button style (outlined)
          color="primary" // Button color (primary)
          onClick={saveClass} // Event handler to save the class (either adding or editing)
        >
          {action === "add" ? "Create" : "Edit"} 
        </Button>
      </DialogActions>



    </Dialog>
  );
}
