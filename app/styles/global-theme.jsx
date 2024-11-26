"use client";

import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: 'dark',
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
