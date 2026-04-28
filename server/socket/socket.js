const http = require("http");
const express = require("express");
const app = express();
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://ripple-chat-app-eight.vercel.app",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

const allOnlineUsers = {};

const getReceiverSocketId = (userId) => allOnlineUsers[userId];

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId !== undefined) {
        allOnlineUsers[userId] = socket.id;
    }

    io.emit("send-all-online-users", Object.keys(allOnlineUsers));

    // Typing events
    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId: userId });
        }
    });

    socket.on("stop-typing", ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stop-typing", { senderId: userId });
        }
    });

    // Read receipt
    socket.on("message-read", ({ senderId, messageId }) => {
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("message-read", { messageId });
        }
    });

    socket.on("disconnect", () => {
        delete allOnlineUsers[userId];
        io.emit("send-all-online-users", Object.keys(allOnlineUsers));
    });
});

module.exports = { app, server, io, getReceiverSocketId };