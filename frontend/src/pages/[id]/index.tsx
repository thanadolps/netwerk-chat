import { useRouter } from "next/router";

import ColorLensIcon from "@mui/icons-material/ColorLens";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  TextField,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import Typography from "@mui/material/Typography";

import ChatListPanel from "@/components/ChatListPanel";
import { useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";
import * as chat from "../../utils/chat";

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
  const [newNickname, setNewNickname] = useState(id);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Fetch data from socket
  const [groups, refetchGroups] = chat.useGroups();
  const [clients, refetchClients] = chat.useUsernames();
  const refetchAll = useCallback(() => {
    refetchGroups();
    refetchClients();
  }, [refetchGroups, refetchClients]);

  useEffect(() => {
    const delay = 1500 + Math.random() * 1500;
    const interval = setInterval(() => {
      console.log("Refetching");
      refetchAll();
    }, delay);
    return () => clearInterval(interval);
  }, [refetchAll]);

  // Handle nickname change and initiliazation
  useEffect(() => {
    chat
      .changeName(id as string)
      .then((x) => refetchClients())
      .catch((err) => {
        // Doesn't seem to actually work right now
        console.log(err);
        toast.error("Failed to change nickname");
      });
  }, [id]);

  // For creating a new group
  const [openCreateGrop, setOpenCreateGroup] = useState(false);

  return (
    <div className="my-10 mx-auto w-[80vw]">
      <Button
        variant="outlined"
        onClick={props.cycleTheme}
        endIcon={<ColorLensIcon />}
        sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
      >
        Change Theme
      </Button>
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
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  router.replace(`/${newNickname}`);
                  refetchClients();
                  handleClose();
                }}
              >
                Change
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      <ChatListPanel
        chatCards={
          clients
            ?.filter((client) => client !== id)
            .map((client) => ({
              title: client,
              action() {
                router.push(`/${id}/dm/${client}`);
              },
            })) ?? []
        }
        groupCards={[
          ...(groups?.map((group) => ({
            title: group,
            action() {
              router.push(`/${id}/group/${group}`);
            },
          })) ?? []),
          {
            title: "Create Group",
            action() {
              setOpenCreateGroup(true);
            },
          },
        ]}
      />

      <CreateGroupDialog
        open={openCreateGrop}
        onClose={() => setOpenCreateGroup(false)}
        afterCreate={() => {
          refetchGroups();
        }}
        blacklist={["dm", ...(groups?.map((g) => g.toLowerCase()) ?? [])]}
      />
    </div>
  );
};

function CreateGroupDialog(props: {
  open: boolean;
  onClose: () => void;
  afterCreate?: () => void;
  blacklist?: string[];
}) {
  const [group, setGroup] = useState("");

  const handleCreateGroup = async () => {
    if (props.blacklist?.includes(group.toLowerCase())) {
      toast.error(`Group ${group} already exists or in used`);
      return;
    }

    await chat.createGroup(group);
    toast.success(`Created group ${group}`);
    props.onClose();
    props.afterCreate?.();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Create Group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="group"
          type="text"
          fullWidth
          variant="standard"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button onClick={handleCreateGroup}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MainPage;
