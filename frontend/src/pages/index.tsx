import Image from "next/image";
import { Inter } from "next/font/google";
import { Button, TextField, Typography } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props: any) {
  return (
    <main
      className={`flex min-h-screen flex-col justify-center items-center gap-10 p-24 ${inter.className}`}
    >
      <Button
        variant="outlined"
        onClick={props.cycleTheme}
        endIcon={<ColorLensIcon />}
        sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
      >
        Change Theme
      </Button>
      <Typography variant="h2">Welcome to ChatTGT</Typography>
      <Typography variant="h3">ChatToGeTher</Typography>
      <TextField id="outlined-basic" label="Nickname" variant="outlined" />
    </main>
  );
}
