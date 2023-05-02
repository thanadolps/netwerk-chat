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
import dynamic from "next/dynamic";
import { SelectChangeEvent } from "@mui/material";

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

function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(0);
  const [sfx, setSfx] = useState("ting");

  const cycleTheme = () => {
    setTheme((theme + 1) % themeList.length);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSfx(event.target.value as string);
  };

  return (
    <ThemeProvider theme={themeList[theme]}>
      <CssBaseline />
      <Component {...pageProps} cycleTheme={cycleTheme} theme={theme} />
    </ThemeProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
