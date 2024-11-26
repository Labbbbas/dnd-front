"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const AppBarGlobal = () => {
    const messages = [
        "You're the D&Definition of awesome!",
        "Let's D&Dive into the adventure!",
        "Ready to D&Dare greatly today?",
        "Don't worry, we've got this D&Down to a science.",
        "No D&Doubt, you're going to crush this campaign!",
        "Let's D&Dazzle them with your skills!",
        "You're the D&Dream team every DM needs.",
        "It's time to D&Dedicate yourself to epic storytelling!",
        "You've got the D&Drive to defeat any dragon!",
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