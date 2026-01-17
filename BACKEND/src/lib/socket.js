import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

// to store online users
const userSocketMap = {}; // {userId : socketId}

// now creata a socket server, putting a http sever on top of it , and socketServer as io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// apply sockey middleware to all authentications connections
io.use(socketAuthMiddleware);

// we will use this method to check if user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; //return us reciever socket id
}

// when a user connects we liten ti it
io.on("connection", (socket) => {
  console.log("A user Connected.", socket.user.fullName);

  const userId = socket.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // tell every other user and someone is online or signed up, send event to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //take all the keys and sent it back to the client

  socket.on("disconnect", () => {
    console.log("A user disconnected.", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
