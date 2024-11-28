"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const AppBarGlobal = () => {
    const messages = [
        "Just D&Deal With it!",
        "It's time to D&Destroy the darkness!",
        "D&Declare your victory!",
        "Only you can D&Define your destiny!",
        "You have the power to D&Decide your fate!",
        "D&Deceive the enemy!",
        "D&Defy the odds!",
        "D&Deem yourself heroic",
        "D&Dear memories await!",
        "Step into the world of daring D&Deeds.",
        "Will you D&Deem yourself worthy?",
        "Your D&Dear companions await your command.",
        "Prepare for a world full of D&Delightful challenges.",
        "Let's craft some unforgettable D&Dear stories.",
        "D&Dear Dungeon Masters, your stage awaits.",
        "This journey will test your D&Decency and courage.",
        "D&Dear legends are forged in battle.",
        "Every D&Detail matters in your quest.",
        "Only D&Diligent explorers uncover the secrets.",
    ];
    const [randomMessage, setRandomMessage] = useState("");
    useEffect(() => {
        const getRandomMessage = () => {
            return messages[Math.floor(Math.random() * messages.length)];
        };
        setRandomMessage(getRandomMessage());
    }, []);
    return (
        <AppBar position="static">
        <Toolbar
            sx={{ alignSelf: "center" }}
        >
            <Typography
                variant="h3"
                component="div"
                fontFamily={"Georgia"}
            >
            {randomMessage}
            </Typography>
        </Toolbar>
        </AppBar>
    );
    }
export default AppBarGlobal;