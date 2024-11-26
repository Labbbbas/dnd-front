"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AppBarGlobal() {
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
            Just D&Deal With It
            </Typography>
        </Toolbar>
        </AppBar>
    );
    }