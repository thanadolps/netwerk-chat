import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Conversation,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";
import { useRouter } from "next/router";

type ChatProps = {
  cycleTheme: any;
};

const ChatDemo: Function = (props: ChatProps) => {
  const router = useRouter();

  return (
    <div style={styles} className="h-[100vh]">
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back
              onClick={() => {
                router.push("/");
              }}
            />
            <ConversationHeader.Content userName={"Joe"} />
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
