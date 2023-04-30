import { useRouter } from "next/router";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  styled,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { purple, blue } from "@mui/material/colors";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import EditIcon from "@mui/icons-material/Edit";

import ChatListPanel from "@/components/ChatListPanel";
import { useState } from "react";

const ChangeNicknameButton = styled(Button)({
  textTransform: "none",
  fontSize: "1.5rem",
  color: blue[500],
});

type MainPageProps = {
  cycleTheme: any;
};

const MainPage: Function = (props: MainPageProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="my-10 mx-auto w-[80vw]">
      <Typography variant="h4">ChatTGT</Typography>
      <div className="flex justify-between">
        <div className="flex justify-start">
          <ChangeNicknameButton
            variant="text"
            size="large"
            endIcon={<EditIcon />}
            onClick={handleClickOpen}
          >
            Nickname: {id}
          </ChangeNicknameButton>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Change Nickname</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleClose}>Change</Button>
            </DialogActions>
          </Dialog>
        </div>

        <Button
          variant="outlined"
          onClick={props.cycleTheme}
          endIcon={<ColorLensIcon />}
        >
          Change Theme
        </Button>
      </div>

      <ChatListPanel />
    </div>
  );
};

export default MainPage;
