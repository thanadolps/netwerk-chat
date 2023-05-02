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

import { useEffect } from "react";
import { toast } from "react-toastify";
import * as chat from "../../../utils/chat";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import { toUwuOrNotUwu } from "@/utils/uwu";

type ChatProps = {
  cycleTheme: any;
};

export default function DMChat(props: ChatProps) {
  const router = useRouter();
  const id = router.query["id"] as string;
  const user = router.query["user"] as string;

  // Theme
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Chat
  const [{ chats, error }, { send }] = chat.useDM(user);

  useEffect(() => {
    if (error) {
      toast.error(error.data);
    }
  }, [error]);

  // Chat display
  const models: MessageModel[] = chats.map((chat) => ({
    message: `${chat.data}`,
    sender: chat.sender,
    direction: chat.sender === "$me" ? "outgoing" : "incoming",
    position: "single",
  }));

  // Chat send
  const uwu = toUwuOrNotUwu(0.1);
  const handleSend = (message: string) => {
    send(uwu(message.trim(), () => toast.success("uwu"))).catch((err) => {
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
            <ConversationHeader.Content userName={`${user} (Temporary DM)`} />
            <ConversationHeader.Actions>
              <MButton variant="outlined" onClick={props.cycleTheme}>
                Change Theme <ColorLensIcon />
              </MButton>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>
            {models.map((model, i) => (
              <Message key={i} model={model}>
                <Message.CustomContent>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {model.message?.replaceAll("<br>", "\n") ?? ""}
                  </ReactMarkdown>
                </Message.CustomContent>
              </Message>
            ))}
          </MessageList>
          <MessageInput
            attachButton={false}
            placeholder="Type message here (*Italic*/**Bold**)"
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
