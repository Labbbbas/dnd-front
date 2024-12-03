"use client";
import { useRouter } from "next/navigation"; 

import { Box, Button, Card, CardActions, CardMedia, Container, IconButton, Slide, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CardContent from '@mui/material/CardContent';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import the back arrow icon

import AddCircleIcon from '@mui/icons-material/AddCircle';
import Alerts from "../components/alerts";
import NpcDialog from "./components/npc-dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import { darkTheme } from "../styles/global-theme";

export default function Npcs() {
  const router = useRouter();

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

    //To homepage
    const handleBack = () => {
      router.push("/"); // to homepage
    };

  // Fetch NPC data when the component mounts
  useEffect(() => {
    fetchNpcs();
  }, []);

  // Function to fetch NPC data from the server
  const fetchNpcs = async () => {
    try {
      const response = await axios.get("https://localhost:8004/api/v1/npcs");
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
      await axios.delete(`https://localhost:8004/api/v1/npcs/${id}`);
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
        {/* Button to add a new class */}
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", mb: 2, mt: 2,}}>

        {/* Button to Home*/}
        <Button
          onClick={handleBack}
          variant="outlined"

          sx={{
            position: "absolute",
            top: 90,
            left: 30,
            borderRadius: "50%",
            width: 50,
            height: 50,
            minWidth: 0, 
            padding: 0,
          }}
        >
          <ArrowBackIcon />
        </Button>        

        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          NPCS
        </Typography>

        {/* Banner */}
        <img
          src="/bannerPages.png"
          alt="Banner"
          style={{
            width: "60%", // Ensures the image fits the container
            objectFit: "cover", // Crops the image proportionally to fill the container
          }}
        />

        {/*Button ADD*/}
      <Button
        startIcon={<AddCircleIcon />}
        variant="contained"
        sx={{ borderRadius: 3, mt: 2 }} // Adds margin-top to create space below the image
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
