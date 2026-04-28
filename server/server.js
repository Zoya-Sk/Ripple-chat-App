const express = require("express");
const dbConnect = require("./config/dbConnection");
const authRoute = require("./routes/authRoute");
const messageRoute = require("./routes/messageRoute");
const cors = require("cors");
const { app, server } = require("./socket/socket");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: "https://ripple-chat-app-eight.vercel.app",
    credentials: true,
}));
app.use(express.json());

// mount the route
app.use("/api/v1", authRoute)
app.use("/api/v1", messageRoute)

dbConnect();

server.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);   
});