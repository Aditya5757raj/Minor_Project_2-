const { Server } = require("socket.io");
const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http');
const bcrypt = require("bcrypt");
const path = require('path')
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

// 📝 Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
      // Check if user exists
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

      res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ success: false, message: "Error registering user" });
  }
});

// 🔐 Signin Route
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
      // Fetch user from database
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (users.length === 0) {
          return res.status(400).json({ success: false, message: "User not found" });
      }

      const user = users[0];

      // Compare password
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

app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
})

const server = http.createServer(app);
const io = new Server(server,{cors:true})


const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        email: socketidToEmailMap.get(socketId),
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
    io.to(room).emit("user:joined", { email, id: socket.id });

    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
    io.to(socket.id).emit("room:join", data);
    const clients = getAllConnectedClients(room);
    clients.forEach(({ socketId }) => {
      io.emit("new", { clients });
    });
  });

  socket.on("code:change", ({ roomId, code }) => {
    console.log("cdoe" ,code);
    socket.in(roomId).emit("code:change", { code });

    console.log(roomId);
  });
  // for handling video off event

  socket.on("user:video:toggle", ({ to, isVideoOff, email }) => {
    console.log("user:video:toggle", to, isVideoOff, email);
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
  // handling code output
  socket.on("output", ({ roomId, output }) => {
    console.log("output", output);
    socket.in(roomId).emit("output", { output });
  });

  socket.on("language:change",({roomId,language,snippet})=>{
    console.log(snippet,roomId);
    socket.in(roomId).emit("language:change",{language,snippet})
  })
  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    // console.log("peer:nego:done", ans);

    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("leave:room", ({ roomId, email }) => {
    socket.leave(roomId);
    console.log(`${email} left ${roomId}`);
    socket.to(roomId).emit("user:left", { email });
  });

  socket.on("wait:for:call", ({ to, email }) => {
    console.log("wait:for:call", to, email);
    io.to(to).emit("wait:for:call", { from: socket.id, email });
  });
  socket.on("disconnecting", () => {
 
    io.emit("user:left", { id: socket.id });

    console.log(`Socket Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Listening on port localhost:${PORT}`));
