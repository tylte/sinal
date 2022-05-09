import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const port = 4000;

const server = createServer(app);
const io = new Server(server);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.emit("hello", "world");
  console.log("Connection !");
});

server.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
