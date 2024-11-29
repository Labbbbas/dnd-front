"use client";

import { createTheme } from '@mui/material/styles';

// Definición de temas
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: '#f939ff',
    },
    secondary: {
      main: '#fb2e2e',
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#f939ff',
    },
    secondary: {
      main: '#fb2e2e',
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export { lightTheme, darkTheme };
