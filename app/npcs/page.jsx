"use client";
import { Box, Button, Card, CardActions, CardMedia, Container, IconButton, Slide, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CardContent from '@mui/material/CardContent';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Alerts from "../components/alerts";
import NpcDialog from "./components/npc-dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import { darkTheme } from "../styles/global-theme";

export default function Npcs() {
  // State for tracking the current action (add, edit, view)
  const [action, setAction] = useState("");

  // State for managing the visibility of the dialog
  const [openDialog, setOpenDialog] = useState(false);

  // State for storing NPC cards data
  const [npcCards, setNpcCards] = useState([]);

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

  // State for storing individual NPC data
  const [npcData, setNpc] = useState({
    _id: null,
    named: "",
    role: "",
    picture: "",
    personality: "",
    inventory: "",
    likes: "",
    money: "",
    backstory: "",
  });

  // Fetch NPC data when the component mounts
  useEffect(() => {
    fetchNpcs();
  }, []);

  // Function to fetch NPC data from the server
  const fetchNpcs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/npcs");
      setNpcCards(response.data); // Update npcCards state with fetched data

      // Make items visible with a delay
      response.data.forEach((_, index) => {
        setTimeout(() => {
          setVisible((prevVisible) => [...prevVisible, index]);
        }, index * 300);
      });
    } catch (error) {
      setAlert({
        message: "Failed to load NPCs",
        severity: "error"
      });
      setOpenAlert(true); // Show alert on error
    }
  };

  // Function to handle actions on NPCs (add, edit, view)
  const handleNpc = ({ action, npcData }) => {
    console.log("npcData", npcData);
    setNpc(npcData); // Set the current NPC data
    setAction(action); // Set the current action
    setOpenDialog(true); // Open the dialog
    playClick(); // Play click sound effect
  };

  // Function to delete an NPC by ID
  const deleteNpc = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/v1/npcs/${id}`);
      setNpcCards(npcCards.filter((npc) => npc._id !== id)); // Remove deleted NPC from npcCards
      setAlert({
        message: "Your NPC has been obliterated!",
        severity: "success"
      });
    } catch (error) {
      setAlert({
        message: "Failed to delete NPC",
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
          onClick={() => handleNpc({ action: "add", npcData: {} })} // Handle adding a new NPC
        >
          Add NPC
        </Button>
      </Box>
      <Grid container spacing={4} justifyContent={"center"}>
        {npcCards.map((iterator, index) => (
          <Slide in={visible.includes(index)} direction="up" key={iterator._id} timeout={{ enter: 300 }}>
            <Grid xs={12} sm={4} md={2} key={iterator._id}>
              <Card
                onClick={() => handleNpc({ action: "view", npcData: iterator })}
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
                  alt="NPC"
                  height="300"
                  image={iterator.picture}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {iterator.named}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.role}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.personality}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.money}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "right" }}>
                  <IconButton
                    color="primary"
                    alt="Edit"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the dialog
                      handleNpc({ action: "edit", npcData: iterator }); // Handle editing the NPC
                    }}
                  >
                    <AutoFixHighIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    alt="Delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the dialog
                      deleteNpc(iterator._id); // Handle deleting the NPC
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
      <NpcDialog
        open={openDialog}
        setOpen={setOpenDialog}
        npcData={npcData}
        setNpc={setNpc}
        action={action}
        npcCards={npcCards}
        setNpcCards={setNpcCards}
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
