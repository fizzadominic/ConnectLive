import { Server } from "socket.io";
import  http  from "http";
import express from "express";
import { ENV } from "./env.js";
import  {socketAuthMiddleware}  from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

// now creata a socket server, putting a http sever on top of it , and socketServer as io
const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply sockey middleware to all authentications connections
io.use(socketAuthMiddleware);

// to store online users 
const userSocketMap = {}; // {userId : socketId}


// when a user connects we liten ti it
io.on("Connection", (socket)=>{
    console.log("A user Connected.", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    // tell every other user and someone is online or signed up, send event to all connected clients 
    io.emit(getOnlineUsers, Object.keys(userSocketMap)); //take all the keys and sent it back to the client

    socket.on("disconnets", ()=>{
      console.log("A user disconnected.", socket.user.fullName);
      delete userSocketMap[userId];
      io.emit(getOnlineUsers, Object.keys(userSocketMap));
    });
});

export {io, app, server};