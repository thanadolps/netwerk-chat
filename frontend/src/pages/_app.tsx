import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Import Roboto font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";

const whiteTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const themeList = [whiteTheme, darkTheme];

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(0);
  const cycleTheme = () => {
    setTheme((theme + 1) % themeList.length);
  };

  return (
    <ThemeProvider theme={themeList[theme]}>
      <CssBaseline />
      <Component {...pageProps} cycleTheme={cycleTheme} />
    </ThemeProvider>
  );
}
