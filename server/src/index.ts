import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { get_word, get_id } from "./Endpoint/start_game";
import cors from "cors";
import { get_dictionary } from "./Endpoint/dictionary";
import { get_guess } from "./Endpoint/guess";
import { v4 as uuidv4 } from 'uuid';
import "./utils/type.ts";
import { Lobby, lobbyMap } from "./utils/type";


export var idToWord : Map<string,string> = new Map();
let rooms : Map<string,Array<Socket>> = new Map(); 

const app = express();
const port = 4000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/dictionary", (_, res) => {
  res.send(get_dictionary());
});

app.post("/start_game", (req, res) => {
 let id = get_id();
 let word = get_word();
 idToWord.set(id, word);
 console.log(word);
 res.send( {length:word.length, first_letter:word.charAt(0), id:id, nb_life:6});
});

app.post("/guess", (req, res) => {
  let id = req.body.id;
  let word = req.body.word;
  console.log(io.sockets);
  res.send( get_guess( id, word, idToWord ) );
});

io.on("connection", (socket) => {
/* socket.on('create', function(room) {
  console.log(rooms);
   socket.join(room);
 });*/
 socket.on('join_lobby', function({ lobbyId, playerId, playerName, isPublic }) {
  socket.join(lobbyId);
  if(lobbyMap.get(lobbyId) !== undefined) {
    lobbyMap.set(lobbyId, new Lobby(lobbyId, "pre-game", lobbyMap.get(lobbyId)!.name, 2, playerName, isPublic, "1vs1"));
    socket.emit("join_lobby_response", {success: true,
      message: "Le lobby à été rejoins !"});
    } else {
      socket.emit("join_lobby_response", {success: false,
        message: "Le lobby donné n'éxiste pas !"});
    }
});

});

server.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
