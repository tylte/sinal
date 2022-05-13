import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { get_word, get_id } from "./Endpoint/start_game";
import cors from "cors";
import { get_dictionary } from "./Endpoint/dictionary";
import { get_guess } from "./Endpoint/guess";
import "./utils/type.ts";
import { Lobby, lobbyMap, Player, playerMap } from "./utils/type";

export var idToWord: Map<string, string> = new Map();

const app = express();
const port = 4000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
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
  res.send({
    length: word.length,
    first_letter: word.charAt(0),
    id: id,
    nb_life: 6,
  });
});

app.post("/guess", (req, res) => {
  let id = req.body.id;
  let word = req.body.word;
  console.log(io.sockets);
  res.send(get_guess(id, word, idToWord));
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("create_lobby", function ({ mode, place, isPublic, owner, name }) {
    let lobbyId = get_id();
    let lobby: Lobby = {
      id: lobbyId,
      state: "pre-game",
      name: name,
      totalPlace: 0,
      currentPlace: 1,
      playerList: new Array<Player>(),
      owner: owner.id,
      isPublic: isPublic,
      mode: mode,
    };

    if (mode == "1vs1") lobby.totalPlace = 2;
    else lobby.totalPlace = place;

    let player = playerMap.get(owner.id);
    if (player !== undefined) lobby.playerList.push(owner);
    else {
      playerMap.set(owner.id, owner);
      lobby.playerList.push(owner);
    }

    lobbyMap.set(lobbyId, lobby);
  });

  socket.on("join_lobby", function (result) {
    let lobby = lobbyMap.get(result.lobbyId);
    if (lobby !== undefined) {
      if (lobby.currentPlace < lobby.totalPlace) {
        socket.join(result.lobbyId);

        lobby.playerList[lobby!.currentPlace];
        lobby.currentPlace++;

        playerMap.set(result.playerId, {
          id: result.playerId,
          name: result.playerName,
        });
        socket.emit("join_lobby_response", {
          success: true,
          message: "Le lobby à été rejoins !",
        });
      } else {
        socket.emit("join_lobby_response", {
          success: false,
          message: "Le lobby est déja plein !",
          lobby: lobby,
        });
      }
    } else {
      console.log("enter");
      socket.emit("join_lobby_response", {
        success: false,
        message: "Le lobby donné n'existe pas !",
      });
    }
  });

  socket.on("leave_lobby", (params) => {
    // params : roomId, playerId
    const playerList = lobbyMap.get(params.roomId)?.playerList;
    if (playerList !== undefined) {
      for (var i = 0; i < playerList.length; i++) {
        if (playerList[i].id === params.playerId) {
          playerList.splice(i, 1);
          i--;
        }
      }
    }
    socket.leave(params.roomId);
    console.log("Joueur retiré");
  });

  socket.on("create_player", (playerName) => {
    let playerId = get_id();
    playerMap.set(playerId, playerName);
    socket.emit("create_player_response", playerId);
  });
});

// TODO : Disconnect ?
io.on("disconnect", (socket) => {});

server.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
