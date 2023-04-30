import * as chat from "../../utils/chat";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Input, MenuItem, Select, TextField } from "@mui/material";

export default function Chat() {
  const [groups, refetch] = chat.useGroups();

  const [groupName, setGroupName] = useState("");

  return (
    <div>
      {groups && (
        <Select
          value={groupName}
          onChange={(x) => setGroupName(x.target.value)}
        >
          {groups.map((g, i) => (
            <MenuItem key={i} value={g}>
              {g}
            </MenuItem>
          ))}
        </Select>
      )}

      {groupName && <ChatRoom groupName={groupName} />}
    </div>
  );
}

function ChatRoom(props: { groupName: string }) {
  const [{ chats, error }, { send }] = chat.useChat(props.groupName);

  const [msg, setMsg] = useState("");

  return (
    <div>
      {/* <TextField
        label="New Name"
        onChange={(x) => chat.changeName(x.target.value)}
      /> */}

      <div>
        Groups:
        {JSON.stringify(props.groupName)}
      </div>

      <TextField
        label="Message"
        value={msg}
        onChange={(x) => setMsg(x.target.value)}
      />
      {/* {JSON.stringify(error)} */}
      {/* {JSON.stringify(groups)} */}

      <ol>
        {chats.map((chat) => (
          <li key={chat.data}>
            <b>{chat.sender}</b>: <span>{chat.data}</span>
          </li>
        ))}
      </ol>

      <Button
        onClick={() => {
          send(msg);
        }}
      >
        Send Chat
      </Button>
    </div>
  );
}
