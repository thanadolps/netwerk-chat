import ColorLensIcon from "@mui/icons-material/ColorLens";
import { Button, TextField, Typography } from "@mui/material";
import { Inter } from "next/font/google";

import { useForm } from "@felte/react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props: any) {
  const router = useRouter();
  const { form } = useForm<{ nickname: string }>({
    onSubmit({ nickname }) {
      router.push(`/${nickname}`);
    },
  });

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
      <form ref={form}>
        <TextField
          id="outlined-basic"
          name="nickname"
          label="Nickname"
          variant="outlined"
        />
      </form>
    </main>
  );
}
