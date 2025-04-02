import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle joining group rooms
  socket.on("joinGroup", (groupId) => {
    console.log(`User ${userId} joining group ${groupId}`);
    socket.join(groupId);
  });

  // Handle leaving group rooms
  socket.on("leaveGroup", (groupId) => {
    console.log(`User ${userId} leaving group ${groupId}`);
    socket.leave(groupId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Function to emit group messages
export function emitGroupMessage(groupId, message) {
  io.to(groupId).emit("newGroupMessage", message);
}

export { io, app, server };
