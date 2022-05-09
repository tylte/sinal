import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { get_word, get_id } from"./Endpoint/start_game";
export interface IHash {
  [details: string] : string;
} 

var tab : IHash = {};
let id;
let word;

const app = express();
const port = 4000;

const server = createServer(app);
const io = new Server(server);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  id = get_id();
  word = get_word();
  tab[id] = word;
  socket.emit("init", word.split('')[0], id);
  console.log(get_word().split('')[0]);
  console.log("Connection !");
});

server.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
