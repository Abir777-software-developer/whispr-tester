import express from "express";
// import { chats } from "./data/data.js";
// import { config } from "dotenv";
import { connectDB } from "./database/index.js";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorniddleware.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://whispr-frontend-tkm3.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json()); //to accept json data
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//two error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server started on port ${PORT}`));
// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  let currentUserId = null;

  socket.on("setup", (userData) => {
    currentUserId = userData._id;
    socket.join(currentUserId);
    // console.log(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newmessagereceived) => {
    var chat = newmessagereceived.chat || newmessagereceived.Chat;
    //if (!chat.users) return console.log("chat.users not defined");

    if (!chat?.users || !newmessagereceived?.sender) {
      console.log(
        "Invalid message received:",
        JSON.stringify(newmessagereceived, null, 2)
      );
      return;
    }
    chat.users.forEach((user) => {
      if (user._id == newmessagereceived.sender._id) return;

      socket.in(user._id).emit("message received", newmessagereceived);
    });
  });
  // socket.off("setup", () => {
  //   console.log("user disconnected");
  //   socket.leave(userData._id);
  // });
  socket.on("disconnect", (reason) => {
    console.log("User disconnected:", socket.id, "Reason:", reason);
    if (currentUserId) {
      socket.leave(currentUserId);
      console.log("User left room:", currentUserId);
    }
  });
});
