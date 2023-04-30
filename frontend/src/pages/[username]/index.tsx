import { useRouter } from "next/router";

import { Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import ColorLensIcon from "@mui/icons-material/ColorLens";

import ChatListPanel from "@/components/ChatListPanel";

type MainPageProps = {
  cycleTheme: any;
};

const MainPage: Function = (props: MainPageProps) => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <div className="my-10 mx-auto w-[80vw]">
      <h1>CHAT</h1>

      <div className="flex justify-between">
        <Typography variant="h4">{username}</Typography>
        <TextField id="outlined-basic" label="Nickname" variant="outlined" />
        <Button
          variant="outlined"
          onClick={props.cycleTheme}
          endIcon={<ColorLensIcon />}
        >
          Change Theme
        </Button>
      </div>

      <ChatListPanel></ChatListPanel>
    </div>
  );
};

export default MainPage;
