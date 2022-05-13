import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { get_word, get_id } from "./Endpoint/start_game";
import cors from "cors";
import { get_dictionary } from "./Endpoint/dictionary";
import { get_guess } from "./Endpoint/guess";
import "./utils/type.ts";
import { lobbyMap, Player, playerMap, Result, LobbyType } from "./utils/type";

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

  socket.on("create_lobby", function (result) {
    if (Result.safeParse(result).success) {
      let lobbyId = get_id(); // TODO
      let lobby: LobbyType = {
        id: lobbyId, //TODO
        state: "pre-game",
        name: result.name,
        totalPlace: 0,
        currentPlace: 1,
        playerList: new Array<Player>(),
        owner: result.owner.id,
        isPublic: result.isPublic,
        mode: result.mode,
      };
      if (result.mode == "1vs1") lobby.totalPlace = 2;
      else lobby.totalPlace = result.place;
      let player = playerMap.get(result.owner.id);
      if (player !== undefined) lobby.playerList.push(result.owner);
      else {
        playerMap.set(result.owner.id, result.owner);
        lobby.playerList.push(result.owner);
      }

      lobbyMap.set(lobbyId, lobby);
      socket.join(lobbyId);
      socket.emit("create_lobby_response", lobbyId);
    } else {
      console.log("erreur create_lobby");
    }
  });
  socket.on("join_lobby", function ({ lobbyId, player: { id, name } }) {
    // params : lobbyId, player {id, name}
    if (Player.safeParse({ id, name }).success && typeof lobbyId === "string") {
      let lobby = lobbyMap.get(lobbyId);
      if (lobby !== undefined) {
        if (lobby.currentPlace < lobby.totalPlace) {
          console.log("join");
          socket.join(lobbyId);

          lobby.playerList[lobby.currentPlace] = {
            id: id,
            name: name,
          };
          lobby.currentPlace++;

          socket.emit("join_lobby_response", {
            success: true,
            message: "Le lobby à été rejoins !",
          });
          console.log(lobby);
        } else {
          socket.emit("join_lobby_response", {
            success: false,
            message: "Le lobby est déja plein !",
            lobby: lobby,
          });
        }
      } else {
        socket.emit("join_lobby_response", {
          success: false,
          message: "Le lobby donné n'existe pas !",
        });
      }
    } else {
      console.log("erreur join_lobby");
    }
  });

  socket.on("leave_lobby", ({ roomId, id }) => {
    // params : roomId, playerId
    if (typeof roomId === "string" && typeof id === "string") {
      const playerList = lobbyMap.get(roomId)?.playerList;
      if (playerList !== undefined) {
        for (var i = 0; i < playerList.length; i++) {
          if (playerList[i].id === id) {
            playerList.splice(i, 1);
            i--;
          }
        }
      }
      socket.leave(roomId);
      console.log("Joueur retiré");
    } else {
      console.log("erreur leave_lobby");
    }
  });

  socket.on("create_player", (playerName) => {
    if (typeof playerName === "string") {
      let playerId = get_id();
      playerMap.set(playerId, { id: playerId, name: playerName });
      socket.emit("create_player_response", playerId);
    }
  });
});

// TODO : Disconnect ?
io.on("disconnect", (socket) => {});

server.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
