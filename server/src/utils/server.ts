import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { get_lobbies } from "../Endpoint/lobbies";
import { get_dictionary } from "../Endpoint/dictionary";
import { get_guess } from "../Endpoint/guess";
import { get_id, get_word } from "../Endpoint/start_game";
import {
  ArgCreateLobby,
  ArgJoinLobby,
  lobbyMap,
  LobbyType,
  Player,
  playerMap,
} from "./type";

export var idToWord: Map<string, string> = new Map();
export const getServer = () => {
  const app = express();

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

  app.get("/list_lobbies", (_, res) => {
    res.send(get_lobbies());
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
      let check = ArgCreateLobby.safeParse(result);
      if (check.success) {
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
        console.log("create_lobby payload : ", result);
        console.log("create_lobby : ", check);
      }
    });
    socket.on("join_lobby", function (result) {
      let check = ArgJoinLobby.safeParse(result);
      if (check.success) {
        const { playerId, lobbyId } = check.data;
        let lobby = lobbyMap.get(lobbyId);
        let player = playerMap.get(playerId);
        if (lobby !== undefined && player !== undefined) {
          if (lobby.currentPlace < lobby.totalPlace) {
            console.log("join");
            socket.join(result.lobbyId);

            lobby.playerList.push({
              id: player.id,
              name: player.name,
            });
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
        console.log("join_lobby payload : ", result);
        console.log("join_lobby : ", check);
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

    socket.on(
      "create_player",
      (playerName, response: (payload: string) => void) => {
        if (typeof playerName === "string") {
          let playerId = get_id();
          playerMap.set(playerId, { id: playerId, name: playerName });
          //response("Rly !?");
          socket.emit("create_player_response", playerId);
        }
      }
    );
  });

  // TODO : Disconnect ?
  io.on("disconnect", (socket) => {});

  return server;
};
