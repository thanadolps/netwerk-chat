// @ts-nocheck

import {
  Button,
  ChatContainer,
  ConversationHeader,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { useRouter } from "next/router";

type ChatProps = {
  theme: number;
  cycleTheme: any;
};

const ChatDemo: Function = (props: ChatProps) => {
  const router = useRouter();

  return (
    <div
      style={styles}
      className={`h-[100vh] ${props.theme == 1 ? "invert" : ""}`}
    >
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back
              onClick={() => {
                router.push("/");
              }}
            />
            <ConversationHeader.Content userName={"Joe"} />
            <ConversationHeader.Actions>
              <Button
                variant="outlined"
                onClick={props.cycleTheme}
                endIcon={<ColorLensIcon />}
              >
                Change Theme
              </Button>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>
            <Message
              model={{
                message: "Hello my friend",
                sentTime: "just now",
                sender: "Joe",
              }}
            >
              <Message.Header sender="Joe" />
            </Message>
          </MessageList>
          <MessageInput attachButton={false} placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatDemo;
