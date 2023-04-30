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

function getUserName() {
  socket.emit("request", { data: "user_name" });
}

function getChatHist(groupName: string) {
  socket.emit("request", { data: "chat_hist", group_name: groupName });
}

function _send(groupName: string, msg: string) {
  socket.emit("message", { group_name: groupName, data: msg });
}

function join(groupName: string) {
  socket.emit("join_group", { group_name: groupName });
}

function leave(groupName: string) {
  socket.emit("leave_group", { group_name: groupName });
}

export async function changeName(newName: string) {
  return await socket.timeout(3000).emitWithAck("change_user_name", {
    data: newName,
  });
}

export async function createGroup(newGroupName: string) {
  return await socket.timeout(3000).emitWithAck("create_group", {
    group_name: newGroupName,
  });
}

export function useGroups() {
  const [groups, setGroups] = useState<string[]>();

  function refetch() {
    getGroupsNames();
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
  }, []);

  return [groups, refetch] as const;
}

export function useUsernames() {
  const [usernames, setUsernames] = useState<string[]>();

  function refetch() {
    getUserName();
  }

  useEffect(() => {
    const handler = socket.on("response", function (data) {
      if (data["title"] == "user_name") {
        setUsernames(data["data"]);
      }
    });

    refetch();

    return () => {
      handler.off();
    };
  }, []);

  return [usernames, refetch] as const;
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

  useEffect(() => {
    // Setup handlers
    socket.on("response", function (data) {
      console.log("response: ", data);
      if (data["title"] == "chat_hist") {
        console.log("Populating chat history");
        const history: Message[] = data["data"];
        setChats((chats) => [...history, ...chats]);
      }
      if (data["title"] == "join_group") {
        console.log("Joined group ", groupName);
        callbacks?.onJoin?.();
      }
      if (data["title"] == "leave_group") {
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
    if (groupName !== null) {
      getChatHist(groupName);
    }

    return () => {
      if (groupName !== null) {
        console.log("Leaving group ", groupName);
        leave(groupName);
      }
      socket.off("response");
      socket.off("error");
      socket.off("message");
    };
  }, []);

  // Handle group change
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

  return [states, actions] as const;
}
