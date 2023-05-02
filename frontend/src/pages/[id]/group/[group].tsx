import {
  Button,
  ChatContainer,
  ConversationHeader,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageModel,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  FormControlLabel,
  FormGroup,
  Button as MButton,
  Select as MSelect,
  Switch as MSwitch,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import * as chat from "../../../utils/chat";

type ChatProps = {
  cycleTheme: any;
};

export default function GroupChat(props: ChatProps) {
  const router = useRouter();
  const id = router.query["id"] as string;
  const group = router.query["group"] as string;

  // Theme
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Chat
  const [{ chats, error }, { send }] = chat.useChat(group ?? null);
  useEffect(() => {
    if (error) {
      toast.error(error.data);
    }
  }, [error]);

  // Chat display
  const models: MessageModel[] = chats.map((chat) => ({
    message: `${chat.data}`,
    sender: chat.sender,
    direction: chat.sender === id ? "outgoing" : "incoming",
    position: "single",
  }));

  // SFX Button
  const [sfxChecked, setSfxChecked] = useState(false);
  const sfxHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSfxChecked(event.target.checked);
  };
  const label = { inputProps: { "aria-label": "Switch demo" } };

  // SFX
  const sfxLimit = 10;
  const sfx = "ting";
  const audio = useMemo(() => {
    let tingArr = [];
    for (let i = 0; i < sfxLimit - 1; i++) {
      tingArr.push(new Audio("/ting.mp3"));
    }
    tingArr.push(new Audio("/kanye.mp3"));
    return {
      ting: tingArr,
      kanye: new Audio("/kanye.mp3"),
    };
  }, []);

  const [sidx, setSidx] = useState(0);

  function playSfx() {
    audio[sfx][sidx].play();
    setSidx((sidx + 1) % sfxLimit);
    console.log(sidx);
  }

  // Chat send
  const handleSend = (message: string) => {
    console.log("CLICKED");
    if (sfxChecked) playSfx();
    send(message);
  };

  return (
    <div style={styles} className={`h-[100vh] ${isDarkMode ? "invert" : ""}`}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back
              onClick={() => {
                router.push(`/${id}`);
              }}
            />
            <ConversationHeader.Content userName={group} />
            <ConversationHeader.Actions>
              <FormGroup>
                <FormControlLabel
                  control={
                    <MSwitch
                      checked={sfxChecked}
                      onChange={sfxHandleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="SFX"
                />
              </FormGroup>
              <MButton variant="outlined" onClick={props.cycleTheme}>
                Change Theme <ColorLensIcon />
              </MButton>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>
            {models.map((model, i) => (
              <Message key={i} model={model}>
                <Message.Header sender={model.sender} />
              </Message>
            ))}
          </MessageList>
          <MessageInput
            attachButton={false}
            placeholder="Type message here"
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
