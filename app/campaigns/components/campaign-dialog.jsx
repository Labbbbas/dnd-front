"use client";
import CloseIcon from '@mui/icons-material/Close';

import { useState, useEffect, act } from 'react';
import {
    Dialog,
    DateField,
    TextField,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    Select,
    MenuItem,
    InputLabel,
    IconButton,
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

    // Normalize campaignData on initial load or when editing
    const [normalizedCampaignData, setNormalizedCampaignData] = useState({
        id: null,
        title: "",
        dm: "",
        description: "",
        status: "",
        startDate: "",
        endDate: "",
        pc: [],
        ql: "",
    });

    const [playerCharacters, setPlayerCharacters] = useState([
        "Sinko MC",
        "Qatro NX", 
    ]);

    const fetchCharacters = async () => {
        console.log(playerCharacters);

        // Verificar si normalizedCampaignData.pc es un string
        if (campaignData && typeof normalizedCampaignData.pc === "string") {
            // Convertir el string a un array de personajes (eliminando los espacios y separando por coma)
            const charactersArray = normalizedCampaignData.pc.split(',').map(char => char.trim());

            // Agregar estos personajes al estado de playerCharacters, sin duplicados
            setPlayerCharacters((prevState) => {
                // Concatenar los personajes existentes con los nuevos y filtrar los duplicados
                const updatedCharacters = [...prevState, ...charactersArray];
                const uniqueCharacters = [...new Set(updatedCharacters)];
                return uniqueCharacters;
            });
        }

        try {
                      //axios.get("http://characters:8002/api/v1/characters"),
            const response = await axios.get("http://api_campaign:8002/api/v1/campaings");

            setAlert({
                message: "Characters loaded successfully",  
                severity: "success",
            });
            setOpenAlert(true);
            setPlayerCharacters(response.data.map((character) => character.characters));
            // also add the character to the normalizedCampaignData
            if (normalizedCampaignData) {
                setPlayerCharacters((prevState) => [
                    ...prevState,
                    ...normalizedCampaignData.pc,
                ]);
            }
        } catch (error) {
            
            setAlert({
                message: "Error loading characters",
                severity: "error",
            });
            console.log(error);
            
            setOpenAlert(true);
        }
    };

    const formatDateToMDY = (dateString) => {
        const [year, month, day] = dateString.split('-');
        if (!year || !month || !day) {
            return ''; // Return an empty string if any part of the date is missing
        }
        return `${month}-${day}-${year}`;
    };

    const saveCampaign = async () => {
        const campaignDataToSend = {
            ...normalizedCampaignData,
            status: normalizedCampaignData.status,
            pc: normalizedCampaignData.pc, // Remove empty or invalid entries
            startDate: formatDateToMDY(normalizedCampaignData.startDate),
            endDate: formatDateToMDY(normalizedCampaignData.endDate),
        };

        console.log(campaignDataToSend);
        console.log(action);

        if (action === "add") {
            try {
                // axios.post("http://campaigns:8001/api/v1/campaigns", campaignDataToSend);
                const response = await axios.post("http://api_campaign:8002/api/v1/campaigns", campaignDataToSend);
                setRows([...rows, response.data]); // Add the new campaign to the rows
                setAlert({
                    message: "Campaign added successfully",
                    severity: "success",
                });
                setOpenAlert(true); // Show the alert
                handleCloseDialog(); // Close the dialog after saving
            } catch (error) {
                // Check if it's an Axios error
                if (axios.isAxiosError(error)) {
                    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
                        // Handle NetworkError
                        setAlert({
                            message: "Network Error: Please check your connection.",
                            severity: "error",
                        });
                    } else if (error.response && error.response.status === 404) {
                        // Handle 404 error (Not Found)
                        setAlert({
                            message: "API endpoint not found (404).",
                            severity: "error",
                        });
                    } else {
                        // General Axios errors
                        setAlert({
                            message: "Failed to add campaign",
                            severity: "error",
                        });
                        //console.error(error.response);
                    }
                } else {
                    // Non-Axios errors
                    setAlert({
                        message: error.response.data.message,
                        severity: "error",
                    });
                    //console.error(error);
                }
                setOpenAlert(true); // Show the alert
            }
        } else if (action === "edit") {
            try {
                const response = await axios.put(`http://localhost:8001/api/v1/campaigns/${campaignData._id}`, campaignDataToSend);
                setRows(rows.map((row) => (row._id === campaignData._id ? response.data : row))); // Update the campaign in the rows list
                setAlert({
                    message: "Campaign updated successfully",
                    severity: "success",
                });
                setOpenAlert(true); // Show the alert
                handleCloseDialog(); // Close the dialog after saving
            } catch (error) {
                // Check if it's an Axios error
                console.log(error);
                if(error.response){
                    switch (error.response.status) {
                        case 400:
                            setAlert({
                                message: "Bad request: The server did not understand the request.",
                                severity: "error",
                            });
                            break;
                        case 401:
                            setAlert({
                                message: "Error validating title",
                                severity: "error",
                            });
                            break;
                        case 402:
                            setAlert({
                                message: "Error validating description",
                                severity: "error",
                            });
                            break;
                        case 403:
                            setAlert({
                                message: "Error validating DM",
                                severity: "error",
                            });
                            break;
                        case 405:
                            setAlert({
                                message: "Error validating status",
                                severity: "error",
                            });
                            break;
                        case 406:
                            setAlert({
                                message: "Error validating player characters, their size must be 2 or more",
                                severity: "error",
                            });
                            break;
                        case 407:
                            setAlert({
                                message: "Error validating start date",
                                severity: "error",
                            });
                            break;
                        case 408:
                            setAlert({
                                message: "Error validating end date",
                                severity: "error",
                            });
                            break;
                        case 409:
                            setAlert({
                                message: "Error validating quest log",
                                severity: "error",
                            });
                            break;
                        default:
                            setAlert({
                                message: error.response.data.message,
                                severity: "error",
                            });
                            break;    
                    }                     
                    
                }
                setOpenAlert(true); // Show the alert
            }
        }
    };


    const handleRemoveCharacter = (characterToRemove) => {
        const updatedPc = normalizedCampaignData.pc.filter(
            (character) => character !== characterToRemove
        );
        setNormalizedCampaignData((prevState) => ({
            ...prevState,
            pc: updatedPc,
        }));
    };

    const formatDateToYMD = (dateString) => {
        const [month, day, year] = dateString.split('-');
        if (!month || !day || !year) {
            return ''; // Return an empty string if any part of the date is missing
        }
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    useEffect(() => {
        if (campaignData) {
            setNormalizedCampaignData({
                id: campaignData._id,
                title: campaignData.title || "",
                dm: campaignData.dm || "",
                description: campaignData.description || "",
                status: campaignData.status || "",
                startDate: formatDateToYMD(campaignData.startDate) || "",
                endDate: formatDateToYMD(campaignData.endDate) || "",
                pc: campaignData.pc || [],
                ql: campaignData.ql || ""
            });
        }
        fetchCharacters();
    }, [campaignData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNormalizedCampaignData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleStatusChange = (event) => {
        const { value } = event.target;
        setNormalizedCampaignData(prevData => ({
            ...prevData,
            status: value // Keep the array as it is
        }));
    };

    const handleSavingPlayerCharactersChange = (event) => {
        const { value } = event.target;
        setNormalizedCampaignData(prevData => ({
            ...prevData,
            pc: value // Keep the array as it is
        }));
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
                    name="title" // The name of the field for easy identification
                    label="Title" // Label to be displayed in the field
                    fullWidth // Makes the text field take the full width of its container
                    value={normalizedCampaignData.title } // The current value of the "role" field
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
                    value={normalizedCampaignData.dm }
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
                    value={normalizedCampaignData.status} // The current value of the "status"
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
                        value={normalizedCampaignData.startDate || new Date().toISOString().split('T')[0]} // Get today's date in YYYY-MM-DD format
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
                        value={normalizedCampaignData.endDate || new Date().toISOString().split('T')[0]} // Get today's date in YYYY-MM-DD format
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
                        name="pc"
                        multiple
                        value={
                            Array.isArray(normalizedCampaignData.pc)
                                ? normalizedCampaignData.pc
                                : normalizedCampaignData.pc.split(", ").map((char) => char.trim()) || []
                        } // Ensure it is always an array and remove unnecessary spaces
                        onChange={handleSavingPlayerCharactersChange}
                        label="Player Characters"
                    >
                        {/* Ensure these values match exactly with the array items */}
                        {playerCharacters.map((char) => (
                            <MenuItem key={char} value={char}>
                                {char}
                            </MenuItem>
                        ))}
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