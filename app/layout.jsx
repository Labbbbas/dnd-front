"use client";

import React, { createContext, useContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from "@mui/material";
import localFont from "next/font/local";
import { darkTheme, lightTheme } from "./styles/global-theme";
import AppBarGlobal from "./components/appbar-global";
import ThemeButton from "./components/theme-button";
import Head from 'next/head';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Crear el contexto para el tema
const ThemeToggleContext = createContext();

export const useThemeToggle = () => useContext(ThemeToggleContext);

export default function RootLayout({ children }) {
  const [mode, setMode] = useState('dark');

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <html lang="en">
      <Head>
        <title>DND</title>
        <meta name="description" content="DND" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeToggleContext.Provider value={{ toggleTheme, mode }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBarGlobal />
            <ThemeButton />
            {children}
          </ThemeProvider>
        </ThemeToggleContext.Provider>
      </body>
    </html>
  );
}
