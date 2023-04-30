import { io, Socket } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:5069";

declare global {
  var socket: Socket;
}

export const socket = global.socket || io(URL);
