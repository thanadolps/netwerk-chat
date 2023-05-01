import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? process.env.SOCKET_URL
    : "http://localhost:5069";

declare global {
  var socket: Socket;
}

if (!SOCKET_URL) {
  throw new Error("SOCKET_URL is undefined");
}

export const socket = global.socket || io(SOCKET_URL);
