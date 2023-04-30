import { useEffect, useState } from "react";
import { socket } from "./socket";

type Message = {
  sender: string;
  group_name: string;
  data: string;
};

function getGroupsNames() {
  socket.emit("request", { data: "group_name" });
}

function _send(groupName: string, msg: string) {
  socket.emit("message", { group_name: groupName, data: msg });
}

function join(groupName: string) {
  socket.emit("join_group", { data: groupName });
}

function leave(groupName: string) {
  socket.emit("leave_group", { data: groupName });
}

export function useGroups() {
  const [groups, setGroups] = useState<string[]>();

  function refetch() {
    socket.emit("request", { data: "group_name" });
  }

  useEffect(() => {
    const handler = socket.on("response", function (data) {
      if (data["group_name"] == "server") {
        setGroups(data["data"]);
      }
    });

    refetch();

    return () => {
      handler.off();
    };
  });

  return [groups, refetch];
}

export function useChat(
  groupName: string | null,
  callbacks?: {
    onJoin?: () => void;
    onLeave?: () => void;
  }
) {
  const [chats, setChats] = useState<Message[]>([]);
  const [lastestChat, SetLastestChat] = useState<Message>();
  const [error, setError] = useState<Message>();

  const [prevGroup, setPrevGroup] = useState(null);

  useEffect(() => {
    // Setup handlers
    socket.on("response", function (data) {
      if (data["data"] == "join_group") {
        console.log("Joined group ", groupName);
        callbacks?.onJoin?.();
      }
      if (data["data"] == "leave_group") {
        console.log("Leave group ", groupName);
        callbacks?.onLeave?.();
      }
    });

    socket.on("error", (data) => setError(data));

    socket.on("message", (message: Message) => {
      setChats((chats) => [...chats, message]);
      SetLastestChat(message);
    });

    // Inital request
    return () => {
      if (groupName !== null) {
        leave(groupName);
      }
      socket.off("response");
      socket.off("error");
      socket.off("message");
    };
  });

  useEffect(() => {
    if (groupName !== null) {
      console.log("Try joining group ", groupName);
      join(groupName);
    } else {
    }
  }, [groupName]);

  const states = {
    chats,
    lastestChat,
    error,
  };

  const actions = {
    send: (msg: string) => {
      if (groupName) _send(groupName, msg);
    },
  };

  return [states, actions] as [typeof states, typeof actions];
}
