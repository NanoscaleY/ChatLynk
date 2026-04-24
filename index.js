const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Test route (checks if server is alive)
app.get("/", (req, res) => {
  res.send("ChatLynk server is running 💬");
});

// Real-time chat system
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", {
      user: data.user || "Anonymous",
      message: data.message,
      time: new Date().toISOString()
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// IMPORTANT: Render uses process.env.PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("ChatLynk running on port", PORT);
});
