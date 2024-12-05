
  "use client";

import { useRouter } from "next/navigation"; 
import { Box, Button, Card, CardActions, CardMedia, Container, IconButton, Slide, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CardContent from '@mui/material/CardContent';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import the back arrow icon
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Alerts from "../components/alerts";
import CharacterDialog from "./components/character-dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import { darkTheme } from "../styles/global-theme";

export default function Characters() {
  // State for back to homepage.
  const router = useRouter();

  // State for tracking the current action (add, edit, view)
  const [action, setAction] = useState("");

  // State for managing the visibility of the dialog
  const [openDialog, setOpenDialog] = useState(false);

  // State for storing Character cards data
  const [characterCards, setCharacterCards] = useState([]);

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

  // State for storing individual Character data
  const [characterData, setCharacter] = useState({
    id: null,
    characterName: "",
    race: "",
    className: "",
    alignment: "",
    level: "",
    background: "",
    playerName: "",
    picture: "",
  });

  //To homepage
  const handleBack = () => {
    router.push("/"); // to homepage
  };

  // Fetch Character data when the component mounts
  useEffect(() => {
    fetchCharacters();
  }, []);

  // Function to fetch Character data from the server
  const fetchCharacters = async () => {
    try {
      const response = await axios.get("http://api_character:8002/api/v1/characters");
      setCharacterCards(response.data); // Update characterCards state with fetched data

      // Make items visible with a delay
      response.data.forEach((_, index) => {
        setTimeout(() => {
          setVisible((prevVisible) => [...prevVisible, index]);
        }, index * 300);
      });
    } catch (error) {
      setAlert({
        message: "Failed to load Characters",
        severity: "error"
      });
      setOpenAlert(true); // Show alert on error
    }
  };

  // Function to handle actions on Characters (add, edit, view)
  const handleCharacter = ({ action, characterData }) => {
    //console.log("characterData", characterData);
    setCharacter(characterData); // Set the current Character data
    setAction(action); // Set the current action
    setOpenDialog(true); // Open the dialog
    playClick(); // Play click sound effect
  };
  // Random messages for fun when deleting a character
  const randDeleteMessage = () => {
    const messages = [
      "The wizard’s scrolls vanish in a puff of arcane smoke. The character has been erased from existence!",
      "The rogue has disarmed the trap... and the character! It's gone forever.",
      "The bard sang a mournful tune. The character has been deleted.",
      "The barbarian smashed the table! This character is no more.",
      "The cleric cast Banish. The character has been sent to another plane.",
      "The ranger tracked the character to the void. It will trouble you no more.",
      "The paladin judged this character unworthy. Smited and deleted!",
      "The warlock's pact ends here. This character is obliterated!",
      "The dungeon master declares: The character is no longer canon!",
      "The druid transforms it into... nothingness. Character deleted!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Function to delete an Character by ID
  const deleteCharacter = async (id) => {
    try {
      await axios.delete(`http://api_character:8002/api/v1/characters/${id}`);
      setCharacterCards(characterCards.filter((character) => character._id !== id)); // Remove deleted Character from characterCards
      setAlert({
        message: randDeleteMessage(),
        severity: "success"
      });
    } catch (error) {
      setAlert({
        message: "Failed to delete Character",
        severity: "error"
      });
    }
    setOpenAlert(true); // Show alert after deletion
  };

  return (
    <Container maxWidth="xl" disableGutters>
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
          variant="h3"
          fontFamily={"Georgia"}
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          CHARACTERS 
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
          sx={{ borderRadius: 3 }}
          onClick={() => handleCharacter({ action: "add", characterData: {} })} // Handle adding a new Character
        >
          Add Character
        </Button>
      </Box>
      <Grid container spacing={4} justifyContent={"center"}>
        {characterCards.map((iterator, index) => (
          <Slide in={visible.includes(index)} direction="up" key={iterator._id} timeout={{ enter: 300 }}>
            <Grid xs={12} sm={4} md={2} key={iterator._id}>
              <Card
                onClick={() => handleCharacter({ action: "view", characterData: iterator })}
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
                  alt="Character"
                  height="300"
                  image={iterator.picture}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div"
                    sx={{
                      whiteSpace: "normal",    // Allows text to wrap onto the next line
                      wordWrap: "break-word",  // Ensures long words or strings break properly
                      overflow: "hidden",      // Prevents text from spilling outside the container
                      textOverflow: "ellipsis" // Optionally, adds "..." for long overflows}} >
                    }}>
                    {iterator.characterName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.race}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.className}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {iterator.level}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "right" }}>
                  <IconButton
                    color="primary"
                    alt="Edit"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the dialog
                      handleCharacter({ action: "edit", characterData: iterator }); // Handle editing the Character
                    }}
                  >
                    <AutoFixHighIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    alt="Delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the dialog
                      deleteCharacter(iterator._id); // Handle deleting the Character
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
      <CharacterDialog
        open={openDialog}
        setOpen={setOpenDialog}
        characterData={characterData}
        setCharacter={setCharacter}
        action={action}
        characterCards={characterCards}
        setCharacterCards={setCharacterCards}
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

