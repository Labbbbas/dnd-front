"use client";
import { Box, Button, Card, CardActions, CardMedia, Container, IconButton, Slide, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CardContent from '@mui/material/CardContent';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Alerts from "../components/alerts";
import BossDialog from "./components/boss-dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import { darkTheme } from "../styles/global-theme";

export default function Bosses() {
  // State for tracking the current action (add, edit, view)
  const [action, setAction] = useState("");

  // State for managing the visibility of the dialog
  const [openDialog, setOpenDialog] = useState(false);

  // State for storing Boss cards data
  const [bossCards, setBossCards] = useState([]);

  // State for managing the visibility of alerts
  const [openAlert, setOpenAlert] = useState(false);

  // State for storing alert messages and severity
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
  });

  // State for tracking which items are visible
  const [visible, setVisible] = useState([]);

  // Function to handle mouse enter event
  const handleMouseEnter = () => {
    // Play hover sound effect
    const sound = new Audio("/SFX/hover_tick.mp3");
    sound.play().catch(error => console.log("Sound playback error: ", error)); // Catch any playback errors
  }

  const playClick = () => {
    // Play click sound effect
    const sound = new Audio("/SFX/click_ufo.mp3");
    sound.play().catch(error => console.log("Sound playback error: ", error)); // Catch any playback errors
  }

  // State for storing individual Boss data
  const [bossData, setBoss] = useState({
    _id: null,
    named: "",
    typed: "",
    cr: "",
    hp: "",
    ac: "",
    resistances: "",
    immunities: "",
    abilities: "",
  });

  // Fetch Boss data when the component mounts
  useEffect(() => {
    fetchBosses();
  }, []);

  // Function to fetch Boss data from the server
  const fetchBosses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/bosses");
      setBossCards(response.data); // Update bossCards state with fetched data

      // Make items visible with a delay
      response.data.forEach((_, index) => {
        setTimeout(() => {
          setVisible((prevVisible) => [...prevVisible, index]);
        }, index * 300);
      });
    } catch (error) {
      setAlert({
        message: "Failed to load Bosses",
        severity: "error"
      });
      setOpenAlert(true); // Show alert on error
    }
  };

  // Function to handle actions on Bosses (add, edit, view)
  const handleBoss = ({ action, bossData }) => {
    console.log("bossData", bossData);
    setBoss(bossData); // Set the current Boss data
    setAction(action); // Set the current action
    setOpenDialog(true); // Open the dialog
    playClick(); // Play click sound effect
  };

  // Function to delete an Boss by ID
  const deleteBoss = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/v1/Bosses/${id}`);
      setBossCards(bossCards.filter((boss) => boss._id !== id)); // Remove deleted boss from bossCards
      setAlert({
        message: "Your Boss has been obliterated!",
        severity: "success"
      });
    } catch (error) {
      setAlert({
        message: "Failed to delete Boss",
        severity: "error"
      });
    }
    setOpenAlert(true); // Show alert after deletion
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 2 }}>
        <Button
          startIcon={<AddCircleIcon />}
          variant="contained"
          sx={{ borderRadius: 3 }}
          onClick={() => handleBoss({ action: "add", bossData: {} })} // Handle adding a new Boss
        >
          Add Boss
        </Button>
      </Box>
      <Grid container spacing={4} justifyContent={"center"}>
        {bossCards.map((iterator, index) => (
          <Slide in={visible.includes(index)} direction="up" key={iterator._id} timeout={{ enter: 300 }}>
            <Grid xs={12} sm={4} md={2} key={iterator._id}>
              <Card
                onClick={() => handleBoss({ action: "view", bossData: iterator })}
                onMouseEnter={() => handleMouseEnter()}
                sx={{
                  maxWidth: 345,
                  borderRadius: 4,
                  "&:hover": {
                    transform: "scale(1.05)", // Scale on hover
                    boxShadow: `0px 0px 15px 5px ${darkTheme.palette.primary.main}`, // Increase box-shadow on hover
                    filter: "brightness(1.3)", // Brighten the card on hover
                  },
                }}>
                <CardMedia
                  component="img"
                  alt="Boss"
                  height="300"
                  image={iterator.picture}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {iterator.named}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.typed}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.hp}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.immunities}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "right" }}>
                  <IconButton
                    color="primary"
                    alt="Edit"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the dialog
                      handleBoss({ action: "edit", bossData: iterator }); // Handle editing the Boss
                    }}
                  >
                    <AutoFixHighIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    alt="Delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the dialog
                      deleteBoss(iterator._id); // Handle deleting the Boss
                    }}
                  >
                    <WhatshotIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          </Slide>
        ))}
      </Grid>
      <BossDialog
        open={openDialog}
        setOpen={setOpenDialog}
        bossData={bossData}
        setBoss={setBoss}
        action={action}
        bossCards={bossCards}
        setBossCards={setBossCards}
        setAlert={setAlert}
        setOpenAlert={setOpenAlert}
        setVisible={setVisible}
      />
      <Alerts
        open={openAlert}
        setOpen={setOpenAlert}
        alert={alert}
        setAlert={setAlert}
      />
    </Container>
  );
}
