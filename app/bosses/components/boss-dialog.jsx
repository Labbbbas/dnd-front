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

// This component handles showing the dialog for adding, editing, or viewing a boss
export default function BossDialog({
  open,          // Boolean to control dialog visibility
  setOpen,       // Function to set dialog visibility
  bossData,       // State to hold the current boss data
  setBoss,        // Function to update bossData state
  action,        // Current action ("add", "edit", "view")
  bossCards,      // List of current boss cards
  setBossCards,   // Function to update the list of boss cards
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
    "The arcane ritual is incomplete! Fill in every rune to summon your Boss.",
    "The weave rejects your creation. Ensure all elements are in place for your Boss to rise.",
    "Your incantation falters! Fill every field, or the magic will fade into the void",
    "The gods demand more! Every piece of the puzzle must be set for your Boss to awaken.",
    "The summoning circle flickers. Complete the runes to ensure their arrival.",
    "Incomplete spells yield incomplete souls. Finish the chant to craft your Boss.",
    "The tome of creation remains unfinished. Inscribe all details to bring your Boss to life.",
    "Without all the required sigils, the Boss is but a fleeting shadow.",
    "The essence of the Boss is scattered. Only you can unite it by completing all fields.",
    "The gods grow impatient! Grant your Boss the details they deserve.",
    "Your Boss waits in the void. Finish the ritual and give them life."
  ];

  const RandomPick = () => {
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    setRandomMessage(randomMessages[randomIndex]);
  }
  useEffect(() => {
    RandomPick();
  }, []);

  // Save the boss data based on whether it's an "add" or "edit" action
  const saveBoss = async () => {
    if (action === "add") { // If the action is "add"
      try {
        const response = await axios.post("http://127.0.0.1:5000/api/v1/bosses", bossData); // Send data to the server to add the boss
        setBossCards((prevBossCards) => {
          const newBossCards = [...prevBossCards, response.data]; // Add the new boss to the list 
          setVisible((prevVisible) => [...prevVisible, newBossCards.length - 1]); // Animate the new boss 
          return newBossCards; });
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
        const response = await axios.put(`http://127.0.0.1:5000/api/v1/bosses/${bossData._id}`, bossData); // Update boss on the server
        setBossCards(bossCards.map((row) => (row._id === bossData._id ? response.data : row))); // Update the boss in the list
        setAlert({
          message: "The scrolls of destiny have been rewritten. Your Boss is now reborn!", // Success message
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
                message: "Failed to edit Boss", // Error message
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

  // Handle changes in the input fields and update the bossData state
  const handleChange = (event) => {
    setBoss({
      ...bossData, // Keep the current boss data and update only the changed field
      [event.target.name]: event.target.value || "", // Set the new value for the specific field
    });
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle
        style={{ textAlign: "center", fontWeight: "bold", fontSize: "2rem" }}>
       {action === "add" ? "Create Boss" : action === "edit" ? "Reshape Boss" : "Boss Details"}</DialogTitle>
      <DialogContent>
        {/* Render input fields or typography based on action */}
        {action === "view" ? (
          <>
            <Typography variant="body1"><strong>Name:</strong> {bossData.named}</Typography>
            <Typography variant="body1"><strong>Type:</strong> {bossData.typed}</Typography>
            <Typography variant="body1"><strong>Challenge Rating:</strong> {bossData.cr}</Typography>
            <Typography variant="body1"><strong>Hit Points:</strong> {bossData.hp}</Typography>
            <Typography variant="body1"><strong>Armor Class:</strong> {bossData.ac}</Typography>
            <Typography variant="body1"><strong>Resistances:</strong> {bossData.resistances}</Typography>
            <Typography variant="body1"><strong>Immunities:</strong> {bossData.immunities}</Typography>
            <Typography variant="body1"><strong>Abilities:</strong> {bossData.abilities}</Typography>
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
                value={bossData.named}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                margin="dense"
                size="small"
                name="typed"
                label="Type"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={bossData.typed}
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
                value={bossData.picture || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                name="cr"
                label="Challenge Rating"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={bossData.cr}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                name="hp"
                label="Hit Points"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={bossData.hp}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                name="ac"
                label="Armor Class"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={bossData.ac}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                name="resistances"
                label="Resistances"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={bossData.resistances}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="immunities"
                label="Immunities"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={bossData.immunities}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="abilities"
                label="Abilities"
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                value={bossData.abilities}
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
          <Button variant="outlined" color="primary" onClick={saveBoss}>
            {action === "add" ? "Add" : "Edit"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

