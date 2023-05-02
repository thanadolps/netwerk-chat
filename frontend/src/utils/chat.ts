import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";

type GroupMessage = {
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

function send(groupName: string, msg: string) {
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

export async function sendDM(reciever: string, msg: string) {
  return await socket.timeout(3000).emitWithAck("dm", {
    reciever,
    data: msg,
  });
}
/**
 * @example
 * ```tsx
 * const [groups, refetch] = useGroups();
 *
 * return (
 *  <div>
 *    <ul>
 *    Display each groups, typeof  group is a string (group name):
 *    {groups?.map((group: string) => (
 *      <div key={group}>{group}</div>
 *    ))}
 *    </ul>
 *
 *    Refetch the groups when click,
 *    without using refetch, group will only fetch once when component mount
 *    <button onClick={refetch}>Refetch</button>
 *  </div>
 * )
 * ```
 */
export function useGroups() {
  const [groups, setGroups] = useState<string[]>();

  function refetch() {
    getGroupsNames();
  }

  useEffect(() => {
    const handler = socket.on("response", function (data) {
      console.log("DATA = ", data);
      if (data["title"] == "group_name") {
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
      console.log("response: ", data);
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
  },
  configs?: {
    ignoreGroupName?: boolean;
  }
) {
  const [chats, setChats] = useState<GroupMessage[]>([]);
  const [lastestChat, SetLastestChat] = useState<GroupMessage>();
  const [error, setError] = useState<GroupMessage>();

  const historyLock = useRef(false);

  useEffect(() => {
    // Setup handlers
    socket.on("response", function (data) {
      console.log("response: ", data);
      if (data["title"] == "chat_hist") {
        if (historyLock.current) {
          console.log("Duplicate chat history, ignore");
        } else {
          console.log("Populating chat history");
          const history: GroupMessage[] = data["data"];
          setChats((chats) => [...history, ...chats]);

          historyLock.current = true;
        }
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

    socket.on("message", (message: GroupMessage) => {
      if (configs?.ignoreGroupName || message.group_name === groupName) {
        setChats((chats) => [...chats, message]);
        SetLastestChat(message);
      }
    });

    // Inital request
    if (groupName) {
      if (historyLock.current) {
        console.log("Already have chat history, no request");
      } else {
        console.log("Request chat history on group ", groupName);
        getChatHist(groupName);
      }
    }

    return () => {
      console.log("Clearing");
      if (groupName) {
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
    if (groupName) {
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
    send: async (msg: string) => {
      if (groupName) await send(groupName, msg);
    },
  };

  return [states, actions] as const;
}

export function useDM(
  reciever: string,
  callbacks?: {
    onJoin?: () => void;
    onLeave?: () => void;
  }
) {
  // In dm, recive only
  const [{ chats, lastestChat, error }] = useChat("dm", callbacks, {
    ignoreGroupName: true,
  });

  const [fullChats, setFullChats] = useState<GroupMessage[]>([]);
  const [lastestFullChat, setLastestFullChat] = useState<GroupMessage>();

  useEffect(() => {
    if (lastestChat) {
      setFullChats((fullChat) => [...fullChat, lastestChat]);
      setLastestFullChat(lastestChat);
    }
  }, [lastestChat]);

  const actions = {
    send: async (msg: string) => {
      await sendDM(reciever, msg);
      const myMsg = {
        group_name: "dm",
        sender: "$me",
        data: msg,
      };
      setFullChats((fullChat) => [...fullChat, myMsg]);
      setLastestFullChat(myMsg);
    },
  };

  return [
    { chats: fullChats, lastestChat: lastestFullChat, error },
    actions,
  ] as const;
}
