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
    Typography,
    Grid,
  } from "@mui/material";
  import axios from "axios";
  
  import React, { useState, useEffect } from "react";
  
  // This component handles showing the dialog for adding or editing a character
  export default function CharacterDialog({
    open,
    setOpen,
    characterData,
    setCharacter,
    action,
    characterCards,
    setCharacterCards,
    setAlert,
    setOpenAlert,
    setVisible,
  }) {
    
    // Close the dialog when the user clicks cancel or closes it
    const handleCloseDialog = () => {
      setOpen(false); // Close the dialog
    };
  
    // Normalize characterData on initial load or when editing
  
    const [randomMessage, setRandomMessage] = useState("");
    const randomMessages = [
      "Master the art of filling out forms",
      "You can do it! Just fill out the fields",
      "You're almost there! Just fill out the fields",
      "Don't give up! Fill out the fields",
      "You're doing great! Just fill out the fields",
      "Master!! remember to fill out the fields",
      "You're a wizard! Fill out the fields",
      "You're a warrior! Fill out the fields",
    ];
  
    const RandomPick = () => {
      const randomIndex = Math.floor(Math.random() * randomMessages.length);
      setRandomMessage(randomMessages[randomIndex]);
    }
  
    useEffect(() => {
      RandomPick();
    }, []);
  
    // Save the character data based on whether it's an "add" or "edit" action
    const saveCharacter = async () => {
      if (action === "add") { // If the action is "add"
        try {
          console.log(characterCards)
          const response = await axios.post("http://api_character:8002/api/v1/characters", characterData); // Send data to the server to add the character
          setCharacterCards((prevCharacterCards) => {
            const newCharacterCards = [...prevCharacterCards, response.data]; // Add the new character to the characterCards
            setVisible((prevVisible) => [...prevVisible, newCharacterCards.length - 1]); // Make the new character visible
            return newCharacterCards; });
          setAlert({
            message: "Behold! Your creation is alive", // Success message
            severity: "success", // Set the message severity as success
          });
          setOpenAlert(true);
          handleCloseDialog();
        } catch (error) {
          if(error.response.status) {
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
          }else{
            // console.error("Error adding characters", error);
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
          const response = await axios.put(`http://api_character:8002/api/v1/characters/${characterData._id}`, characterData); // Update character on the server
          setCharacterCards(characterCards.map((row) => (row._id === characterData._id ? response.data : row))); // Update the character in the characterCards list
          setAlert({
            message: "The bard improvised. The character sings a new tune!", // Success message
            severity: "success", // Set the message severity as success
          });
          setOpenAlert(true);
          handleCloseDialog();
        } catch (error) {
          if(error.response.status) {
            switch (error.response.status) {
              case 400:
                setAlert({
                  message: randomMessage, // Error message
                  severity: "error", // Set the message severity as error
                });
                break;
              default:
                setAlert({
                  message: "Failed to update character", // Error message
                  severity: "error", // Set the message severity as error
                });
                break;
            }
          }else{
            setAlert({
              message: "Server Error: " + error, // Error message
              severity: "error", // Set the message severity as error
            });
          }
        }
        setOpenAlert(true); // Show the alert
        RandomPick();
      }
    };
  
    // Handle changes in the input fields and update the characterData state
    const handleChange = (event) => {
      setCharacter({
        ...characterData, // Keep the current character data and update only the changed field
        [event.target.name]: event.target.value || "", // Set the new value for the specific field
      });
    };
  
    return (
      <Dialog 
        open={open} 
        onClose={handleCloseDialog}
      > 
        {/* Show the dialog */}
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold", fontSize: "2rem" }}>
          {/* Dialog title changes based on whether we're adding or editing a character */}
          {action === "add" ? "Create Character" : action === "edit" ? "Reshape Character" : "Character Details"}
        </DialogTitle>
        <DialogContent>
          {action === "view" ? (
            <>
              <Typography variant="body1"><strong>Name:</strong> {characterData.characterName}</Typography>
              <Typography variant="body1"><strong>Race:</strong> {characterData.race}</Typography>
              <Typography variant="body1"><strong>Class:</strong> {characterData.className}</Typography>
              <Typography variant="body1"><strong>Alignment:</strong> {characterData.alignment}</Typography>
              <Typography variant="body1"><strong>Level:</strong> {characterData.level}</Typography>
              <Typography variant="body1"><strong>Background:</strong> {characterData.background}</Typography>
              <Typography variant="body1"><strong>Player Name:</strong> {characterData.playerName}</Typography>
            </>
          ) : (
          <Grid container spacing={2} justifyContent="center">

            {/* First row */}
            <Grid container item xs={12} spacing={2} justifyContent="space-between">
            
                {/* Character input field */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        margin="dense" // Adds margin around the text field
                        name="characterName" // The name of the field for easy identification
                        label="Character" // Label to be displayed in the field
                        fullWidth // Makes the text field take the full width of its container
                        value={characterData.characterName || ""} // The current value of the "character" field
                        onChange={handleChange} // Event handler that updates the state when the input changes
                    />
                </Grid>

                {/* Race input field */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        margin="dense"
                        name="race"
                        label="Race"
                        fullWidth
                        value={characterData.race || ""} // The current value of the "
                        onChange={handleChange} // Updates the state when the race changes
                    />
                </Grid>

                {/* Class input field */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        margin="dense"
                        name="className"
                        label="ClassName"
                        fullWidth
                        value={characterData.className || ""} // The current value of the "class" field
                        onChange={handleChange} // Updates the state when the class changes
                    />
                </Grid>

                {/* Alignment selection field */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl  fullWidth margin="dense">
                    <InputLabel>Alignment</InputLabel> {/* Label for the input */}
                    <Select
                        name="alignment" // Name of the field
                        value={characterData.alignment || ""} // The current value of the "alignment"
                        onChange={handleChange} // Updates the state when the alignment changes
                        label="Alignment"
                    >
                        {/* Menu items for the available alignment options */}
                        <MenuItem value="Lawful good">Lawful good</MenuItem>
                        <MenuItem value="Lawful neutral">Lawful neutral</MenuItem>
                        <MenuItem value="Lawful evil">Lawful evil</MenuItem>
                        <MenuItem value="Unaligned">Unaligned</MenuItem>
                        <MenuItem value="Neutral good">Neutral good</MenuItem>
                        <MenuItem value="True neutral">True neutral</MenuItem>
                        <MenuItem value="Neutral evil">Neutral evil</MenuItem>
                        <MenuItem value="Chaotic good">Chaotic good</MenuItem>
                        <MenuItem value="Chaotic neutral">Chaotic neutral</MenuItem>
                        <MenuItem value="Chaotic evil">Chaotic evil</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
            </Grid>
            
            {/* Second row */}
            <Grid container item xs={12} spacing={2} justifyContent="space-between">

                {/* Level input field */}
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    margin="dense"
                    name="level"
                    label="Level"
                    fullWidth
                    type="number" // Restricts input to numbers only
                    value={characterData.level || ""} // The current value of 'level'
                    onChange={handleChange} // Event handler for input change
                    inputProps={{
                      min: 1, // Minimum allowed value
                      step: 1, // The increment of the value (in this case, only integers)
                    }}
                />
                </Grid>

                {/* Background input field */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        margin="dense"
                        name="background"
                        label="Background"
                        fullWidth
                        value={characterData.background || ""} // The current value of the background field
                        onChange={handleChange} // Event handler for when the field changes
                    />
                </Grid>

                {/* Player Name input field */}
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    margin="dense"
                    name="playerName"
                    label="Player Name"
                    fullWidth
                    value={characterData.playerName || ""} // The current value of the player name field
                    onChange={handleChange} // Event handler for when the field changes
                />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        margin="dense" // Adds margin around the text field
                        name="picture" // The name of the field for easy identification
                        label="Picture URL" // Label to be displayed in the field
                        fullWidth // Makes the text field take the full width of its container
                        value={characterData.picture || ""} // The current value of the "character" field
                        onChange={handleChange} // Event handler that updates the state when the input changes
                    />
                </Grid>
            </Grid>
          </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}> 
          <Button 
            variant="outlined" // Button style (outlined)
            color="secondary" // Button color (secondary)
            onClick={handleCloseDialog} // Event handler to close the dialog
          >
            Cancel
          </Button>
          {action !== "view" && (
          <Button 
            variant="outlined" // Button style (outlined)
            color="primary" // Button color (primary)
            // Event handler to save the character (either adding or editing)
            onClick={saveCharacter} // Type of the button (submit)
          >
            {action === "add" ? "Create" : "Edit"} 
          </Button>
          )}
        </DialogActions>  
      </Dialog>
    );
  }