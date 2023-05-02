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
import { Button as MButton } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as chat from "../../../utils/chat";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

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

  // Chat send
  const handleSend = (message: string) => {
    send(message.trim()).catch((err) => {
      toast.error(err);
    });
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
              <MButton variant="outlined" onClick={props.cycleTheme}>
                Change Theme <ColorLensIcon />
              </MButton>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>
            {models.map((model, i) => (
              <Message key={i} model={model}>
                <Message.Header sender={model.sender} />
                <Message.CustomContent>
                  <ReactMarkdown>
                    {model.message?.replaceAll("<br>", "\n") ?? ""}
                  </ReactMarkdown>
                </Message.CustomContent>
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
