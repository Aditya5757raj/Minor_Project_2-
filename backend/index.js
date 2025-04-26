const { Server } = require("socket.io");
const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http');
const bcrypt = require("bcrypt");
const path = require('path');
const mysql = require("mysql2/promise");
app.use(express.json());
app.use(cors());
app.use(express.static('../client/build'));
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection()
    .then(() => console.log("✅ MySQL Database Connected!"))
    .catch((err) => console.error("❌ MySQL Connection Error:", err));

// Auth Routes (unchanged)
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
      res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ success: false, message: "Error registering user" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (users.length === 0) {
          return res.status(400).json({ success: false, message: "User not found" });
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      res.json({ success: true, message: "Login successful", userId: user.id });
  } catch (error) {
      console.error("Signin Error:", error);
      res.status(500).json({ success: false, message: "Error signing in" });
  }
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server, { cors: true });

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
const whiteboardStates = new Map(); // Stores canvas states by room
const whiteboardSettings = new Map(); // Stores brush settings by room

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        email: socketidToEmailMap.get(socketId)
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (data) => {
    const { email, room } = data;

    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);

    io.to(room).emit("user:joined", { email, id: socket.id });
    io.to(socket.id).emit("room:join", data);

    // Initialize room settings if they don't exist
    if (!whiteboardSettings.has(room)) {
      whiteboardSettings.set(room, {
        color: '#000000',
        brushSize: 3
      });
    }

    // Send current whiteboard state to new user
    const canvasState = whiteboardStates.get(room);
    if (canvasState) {
      io.to(socket.id).emit("whiteboard:sync", { canvasState });
    }

    const clients = getAllConnectedClients(room);
    clients.forEach(({ socketId }) => {
      io.emit("new", { clients });
    });
  });

  // Enhanced Whiteboard Events
  socket.on("whiteboard:draw", ({ roomId, x, y, isStart, color, size }) => {
    // Update room settings if provided
    if (color || size) {
      const settings = whiteboardSettings.get(roomId) || {};
      if (color) settings.color = color;
      if (size) settings.brushSize = size;
      whiteboardSettings.set(roomId, settings);
    }

    socket.to(roomId).emit("whiteboard:draw", { 
      x, 
      y, 
      isStart,
      color: color || whiteboardSettings.get(roomId)?.color || '#000000',
      size: size || whiteboardSettings.get(roomId)?.brushSize || 3
    });
  });

  socket.on("whiteboard:update", ({ roomId, canvasState }) => {
    whiteboardStates.set(roomId, canvasState);
    socket.to(roomId).emit("whiteboard:update", { canvasState });
  });

  socket.on("whiteboard:request-sync", ({ roomId }) => {
    const canvasState = whiteboardStates.get(roomId);
    if (canvasState) {
      io.to(socket.id).emit("whiteboard:sync", { canvasState });
    }
  });

  socket.on("whiteboard:clear", ({ roomId }) => {
    whiteboardStates.delete(roomId);
    io.to(roomId).emit("whiteboard:clear");
  });

  // Existing code editor and video chat events
  socket.on("code:change", ({ roomId, code }) => {
    socket.in(roomId).emit("code:change", { code });
  });

  socket.on("user:video:toggle", ({ to, isVideoOff, email }) => {
    io.to(to).emit("remote:video:toggle", { isVideoOff, email });
  });

  socket.on("sync:code", ({ socketId, code }) => {
    io.to(socketId).emit("code:change", { code });
  });

  socket.on("user:call", ({ to, offer, email }) => {
    io.to(to).emit("incomming:call", {
      from: socket.id,
      offer,
      fromEmail: email,
    });
  });

  socket.on("output", ({ roomId, output }) => {
    socket.in(roomId).emit("output", { output });
  });

  socket.on("language:change", ({ roomId, language, snippet }) => {
    socket.in(roomId).emit("language:change", { language, snippet });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("leave:room", ({ roomId, email }) => {
    socket.leave(roomId);
    console.log(`${email} left ${roomId}`);
    socket.to(roomId).emit("user:left", { email });
  });

  socket.on("wait:for:call", ({ to, email }) => {
    io.to(to).emit("wait:for:call", { from: socket.id, email });
  });

  socket.on("disconnecting", () => {
    io.emit("user:left", { id: socket.id });
    console.log(`Socket Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));