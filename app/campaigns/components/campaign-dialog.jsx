import { PieChart } from "@mui/icons-material";
import { useState, useEffect } from 'react';
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
    export default function CampaignDialog({
        open,
        setOpen,
        campaignData,
        setCampaign,
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
    
        // Convert string to array for status (on edit)
        const normalizeStatus = (sts) => {
            return Array.isArray(sts) ? sts : sts.split(", ").filter(Boolean);
        };
    
        // Convert string to array for saving player characters (on edit)
        const normalizePlayerCharacters = (pc) => {
            return Array.isArray(pc) ? pc : PieChart.split(", ").filter(Boolean);
        };
    
        // Normalize campaignData on initial load or when editing
        const normalizedCampaignData = {
            ...campaignData,
            sts: normalizeStatus(campaignData.sts || []), // Normalize primary ability
            pc: normalizePlayerCharacters(campaignData.pc || []), // Normalize saving throw proficiencies
        };
    
        // Save the class data based on whether it's an "add" or "edit" action
        const saveCampaign = async () => {
    
        const campaignDataToSend = {
            ...normalizedCampaignData,
            sts: normalizedCampaignData.sts.join(", "), // Convert array to string when sending data
            pc: normalizedCampaignData.pc.join(", "), // Convert array to string when sending data
        };
    
        if (action === "add") { // If the action is "add"
            try {
            const response = await axios.post("http://127.0.0.1:5000/api/v1/campaigns", campaignDataToSend); // Send data to the server to add the class
            setRows([...rows, response.data]); // Add the new class to the rows
            setAlert({
                message: "Campaign added successfully", // Success message
                severity: "success", // Set the message severity as success
            });
            } catch (error) {
            // console.error("Error adding classes", error);
            setAlert({
                message: "Failed to add campaign", // Error message
                severity: "error", // Set the message severity as error
            });
            }
            setOpenAlert(true); // Show the alert
    
        } else if (action === "edit") { // If the action is "edit"
            try {
            const response = await axios.put(`http://127.0.0.1:5000/api/v1/campaigns/${campaignData._id}`, campaignDataToSend); // Update class on the server
            setRows(rows.map((row) => (row._id === campaignData._id ? response.data : row))); // Update the class in the rows list
            setAlert({
                message: "Campaign updated successfully", // Success message
                severity: "success", // Set the message severity as success
            });
            } catch (error) {
            // console.error("Error updating classes", error);
            setAlert({
                message: "Failed to update campaign", // Error message
                severity: "error", // Set the message severity as error
            });
            }
            setOpenAlert(true); // Show the alert
        }
        handleCloseDialog(); // Close the dialog after saving
        };

        // Set initial values for startDate and endDate when campaignData is loaded or edited
        useEffect(() => {
            if (campaignData) {
            }
        }, [campaignData]);
    
        // Handle changes in the input fields and update the campaignData state
        const handleChange = (event) => {
        setCampaign({
            ...normalizedCampaignData, // Keep the current campaign data and update only the changed field
            [event.target.name]: event.target.value, // Set the new value for the specific field
        });
        };
    
        // Handle changes for multiple selections (Status)
        const handleStatusChange = (event) => {
            const { value } = event.target;
            setCampaign({
                ...normalizedCampaignData,
                sts: value, // Keep the value as an array
                });
        };
    
        // Handle changes for multiple selections (Player Characters)
        const handleSavingPlayerCharactersChange = (event) => {
            const { value } = event.target;
            if (value.length <= 2) { // at least two player characters
                setCampaign({
                    ...normalizedCampaignData,
                    pc: value, // Keep the value as an array
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
            {action === "add" ? "Create Campaign" : "Edit Campaign"}
            </DialogTitle>
    
            <DialogContent>
            <Grid container spacing={2} justifyContent="center">
                
                {/* Name input field */}
                <Grid item xs={12} sm={6} container justifyContent="center">
                    <TextField
                        margin="dense" // Adds margin around the text field
                        name="name" // The name of the field for easy identification
                        label="Name" // Label to be displayed in the field
                        fullWidth // Makes the text field take the full width of its container
                        value={normalizedCampaignData.role} // The current value of the "role" field
                        onChange={handleChange} // Event handler that updates the state when the input changes
                    />
                </Grid>
    
                {/* Dungeon Master input field */}
                <Grid item xs={12} container>
                    <TextField
                        margin="dense"
                        name="dm"
                        label="Dungeon Master"
                        fullWidth
                        value={normalizedCampaignData.dm}
                        onChange={handleChange} // Updates the state when the text changes
                    />
                </Grid>

                {/* Description input field */}
                <Grid item xs={12}>
                <TextField
                    margin="dense"
                    name="description"
                    label="Description"
                    fullWidth
                    value={normalizedCampaignData.description}
                    onChange={handleChange} // Updates the state when the description changes
                />
                </Grid>
    
                {/* Status, Start Date, and End Date in the same row */}
                <Grid container item xs={12} spacing={2}>
                
                {/* Status selection field */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel> {/* Label for the input */}
                    <Select
                        name="status" // Name of the field
                        value={normalizedCampaignData.sts} // The current value of the "status"
                        onChange={handleStatusChange} // Updates the state when the status changes
                        label="Status"
                    >
                        {/* Menu items for the available hit die options */}
                        <MenuItem value="ongoing">Ongoing</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="paused">Paused</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
    
                {/* Start Date selection field */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth margin="dense">
                    <TextField
                        type="date" 
                        name="startDate"
                        label="Start Date"
                        value={normalizedCampaignData.startDate}
                        onChange={handleChange}
                        required
                        fullWidth
                        slotProps={{
                            inputLabel: { shrink: true }, 
                        }}
                    />
                    <FormHelperText>Choose a start date for the campaign</FormHelperText>
                    </FormControl>
                </Grid>

                {/* End Date selection field */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth margin="dense">
                    <TextField
                        type="date" 
                        name="endDate"
                        value={normalizedCampaignData.endDate}
                        onChange={handleChange}
                        label="End Date"
                        required
                        fullWidth
                        slotProps={{
                            inputLabel: { shrink: true }, 
                        }}
                    />
                    <FormHelperText>Choose an end date for the campaign</FormHelperText>
                    </FormControl>
                </Grid>
    
                {/* Saving Player Characters selection field (multiple options) */}
                <Grid item xs={12} sm={4} justifyContent="center">
                    <FormControl fullWidth margin="dense">
                    <InputLabel>Player Characters</InputLabel>
                    <Select
                        name="pc" // The name of the field for easy identification
                        multiple // Allows multiple selections for saving throw proficiencies
                        value={normalizedCampaignData.pc} // The selected saving throw proficiencies
                        onChange={handleSavingPlayerCharactersChange} // Event handler for when the proficiencies change
                        label="Player Characters"
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
                    </Select>
                    <FormHelperText>Select two or more options</FormHelperText>
                    </FormControl>
                </Grid>
                </Grid>
    
                {/* Quest Log input field */}
                <Grid item xs={12}>
                <TextField
                    margin="dense"
                    name="ql"
                    label="Quest Log"
                    fullWidth
                    value={normalizedCampaignData.ql} 
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
                onClick={saveCampaign} // Event handler to save the class (either adding or editing)
            >
                {action === "add" ? "Create" : "Edit"} 
            </Button>
            </DialogActions>
    
    
    
        </Dialog>
        );
    }