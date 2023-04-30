import * as chat from "../../utils/chat";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function Chat() {
  //   const [groups, refetch] = chat.useGroups();
  const [{ chats, error }, { send }] = chat.useChat("default");

  const [msg, setMsg] = useState("");

  return (
    <div>
      <input value={msg} onChange={(x) => setMsg(x.target.value)}></input>
      {/* {JSON.stringify(error)} */}
      {/* {JSON.stringify(groups)} */}

      <ol>
        {chats.map((chat) => (
          <li key={chat.data}>{JSON.stringify(chat.data)}</li>
        ))}
      </ol>

      <Button
        variant="contained"
        onClick={() => {
          send(msg);
        }}
      >
        Send Chat
      </Button>
    </div>
  );
}
