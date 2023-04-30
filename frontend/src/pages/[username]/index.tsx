import ChatListPanel from "@/components/ChatListPanel";
import { NextPage } from "next";
import { useRouter } from "next/router";

const MainPage: NextPage = (props) => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <div>
      <h1>CHAT</h1>
      <h2>{username}</h2>
      <button onClick={props.cycleTheme}>Change Theme</button>
      <ChatListPanel></ChatListPanel>
    </div>
  );
};

export default MainPage;
