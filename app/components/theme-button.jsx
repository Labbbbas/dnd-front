"use client";

import React from 'react';
import { IconButton } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useThemeToggle } from '../layout';

const ThemeButton = () => {
    const { toggleTheme, mode } = useThemeToggle();

    return (
        <IconButton
            onClick={toggleTheme}
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                bgcolor: 'background.paper',
                boxShadow: 3,
                zIndex: 1000,
            }}
        >
            {mode === 'dark' ? <WbSunnyIcon /> : <NightsStayIcon />}
        </IconButton>
    );
};

export default ThemeButton;
