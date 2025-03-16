import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// Map of id and socket
const allSockets = new Map<String, WebSocket[]>();
let socketConnection = 0;

// const obj = { type: "JOIN", roomId: "1234" };
// const obj2 = { type: "CHAT", message: "hi there" };

wss.on("connection", (socket) => {
  socketConnection++;
  console.log("User connected " + socketConnection);

  socket.on("message", (e) => {
    const message = e.toString();

    const parsedMessage = JSON.parse(message);
    const roomId = parsedMessage.roomId;
    if (parsedMessage.type === "JOIN") {
      // If room is already created all socket to that room else create a new room
      if (allSockets.has(roomId)) {
        const sockets = allSockets.get(roomId) as WebSocket[];
        sockets?.push(socket);
        allSockets.set(roomId, sockets);
      } else {
        allSockets.set(roomId, [socket]);
      }
    }

    if (parsedMessage.type === "CHAT") {
      const sockets = allSockets.get(roomId);
      const chat = parsedMessage.message;
      sockets?.forEach((s) => {
        if (s !== socket) {
          s.send(chat);
        }
      });
    }
  });

  // On disconnect remove the socket from allSockets array
  socket.on("disconnect", (socket) => {
    // allSockets.filter((s) => s != socket);
  });
});
