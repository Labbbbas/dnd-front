"use client"; 

import React, { useState } from "react";
import { Grid, Box, Button, Typography } from "@mui/material"; // Importing MUI components for layout and styling
import { useRouter } from "next/navigation"; // For navigating to different pages

const clickEffect = "/clickEffect.mp3"; // Path to the click sound effect
const cardEffect = "SFX/hover_tick.mp3"; // Path to the mouse hover sound effect

// Array of cards, each representing a section with a title, description, image, and link.
const card = [
  { name: "Characters", description: "Create your hero and embark on legendary quests!", tittle: "Characters", img: "https://online.anyflip.com/afgs/xkls/files/mobile/163.jpg", link: "/characters" },
  { name: "Campaigns", description: "Choose your path in epic adventures.", tittle: "Campaigns", img: "https://online.anyflip.com/afgs/xkls/files/mobile/173.jpg", link: "/campaigns" },
  { name: "NPCs", description: "Meet the characters who shape your world.", tittle: "NPCs", img: "https://online.anyflip.com/afgs/xkls/files/mobile/11.jpg", link: "/npcs" },
  { name: "Bosses", description: "Defeat mighty bosses to claim your glory!", tittle: "Bosses", img: "https://online.anyflip.com/afgs/xkls/files/mobile/201.jpg", link: "/bosses" },
  { name: "Classes", description: "Choose your class and harness its power.", tittle: "Classes", img: "https://online.anyflip.com/afgs/xkls/files/mobile/45.jpg", link: "/classes" },
  { name: "Weapons", description: "Equip yourself for the challenges ahead.", tittle: "Weapons", img: "https://online.anyflip.com/afgs/xkls/files/mobile/189.jpg", link: "/weapons" },
];
                  
const HomePage = () => {
  const router = useRouter(); // Hook for navigation
  const [background, setBackground] = useState(""); // State to store the background image when hovering over cards
  const [rotatingIndex, setRotatingIndex] = useState(null); // State to store the index of the rotated card

  const handleMouseEnter = (cardImg) => {
    setBackground(cardImg); // Update the background image on hover
    // Play hover sound effect
    const sound = new Audio(cardEffect);
    sound.play().catch(error => console.log("Sound playback error: ", error)); // Catch any playback errors
  };

  const handleMouseLeave = () => {
    setBackground(""); // Reset background image when mouse leaves
  };

  const handleClick = (cardlink, index) => {
    setRotatingIndex(index); // Set the rotating index when a card is clicked
    const sound = new Audio(clickEffect); // Play click sound effect
    sound.play();

    // Redirect to the corresponding link when the sound ends
    sound.onended = () => {
      router.push(cardlink);
    };
  };

  return (
    <Box
      sx={{
        marginTop: 5,
        backgroundImage: background ? `url(${background})` : "url(/background.png)", // Conditional background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s ease", // Smooth transition for background change
        paddingBottom: "40px",
        paddingLeft: "20px",
        paddingRight: "20px",
        height: "100vh",
      }}
    >
    {/* Banner */}
    <Box
      sx={{
        display: "flex", // Defines a flexible container
        justifyContent: "center", // Aligns the content horizontally
        alignItems: "center", // Aligns the content vertically
        marginBottom: "35px", // Adds space below the box
      }}
    >
      <img
        src="/banner.jpg"
        alt="Banner"
        style={{
          width: "100%", // Stretches the image to the full width of the page
          height: "180px", // Sets a fixed height of 350px
          objectFit: "cover", // Crops the image to fill the defined area without distortion
        }}
      />
    </Box>

      <Grid container spacing={5} justifyContent="center" alignItems="center">
        {/* Mapping over the cards array to display each card */}
        {card.map((card, index) => (
          <Grid item xs={5} sm={6} md={4} lg={2} key={index}>
            <Button
              onClick={() => handleClick(card.link, index)} // Click event to navigate
              onMouseEnter={() => handleMouseEnter(card.img)} // Hover event to change background
              onMouseLeave={handleMouseLeave} // Mouse leave event to reset background
              sx={{
                width: "100%",
                height: 340,
                borderRadius: 5,
                backgroundImage: `url(${card.img})`, // Card background image
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.4)", // Shadow effect
                transition: "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease", // Transitions for hover effects
                animation: `levitate${index} 2s ease-in-out infinite, ${rotatingIndex === index ? "rotateYInfinite 0.7s infinite linear" : "none"}`, // Levitation animation and optional rotation

                "&:hover": {
                  transform: "scale(1.05)", // Scale on hover
                  boxShadow: "0px 0px 15px 5px rgba(255, 255, 255, 0.8)", // Increase box-shadow on hover
                  filter: "brightness(1.3)", // Brighten the card on hover
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background for the card text
                  borderRadius: 1,
                  padding: "8px",
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                {/* Title and description displayed inside the card */}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {card.tittle}
                </Typography>
                <Typography variant="body2">{card.description}</Typography>
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Keyframe animations for levitation and rotation effects */}
      <style jsx>{`
        @keyframes rotateYInfinite {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        @keyframes levitate0 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes levitate1 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes levitate2 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes levitate3 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes levitate4 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-18px);
          }
        }

        @keyframes levitate5 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes levitate6 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes levitate7 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </Box>
  );
};

export default HomePage; 
