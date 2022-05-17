import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { get_lobbies, get_lobby_id } from "../Endpoint/lobbies";
import { get_dictionary } from "../Endpoint/dictionary";
import { get_guess } from "../Endpoint/guess";
import { get_id, get_word } from "../Endpoint/start_game";
import {
  ArgCreateLobby,
  ArgJoinLobby,
  ArgStartGame,
  ArgUpdateWord,
  lobbyMap,
  LobbyType,
  Player,
  playerMap,
} from "./type";
import { checkPrime } from "crypto";

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

  app.get("/list_lobbies/:id", (req, res) => {
    res.send(get_lobby_id(req.params.id));
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

    socket.on(
      "create_lobby",
      (request, response: (payload: string) => void) => {
        if (typeof response !== "function") {
          console.log("create_lobby : response is supposed to be a function");
          return;
        }

        let check = ArgCreateLobby.safeParse(request);
        if (check.success) {
          let { isPublic, mode, name, owner, place: totalPlace } = check.data;
          let lobbyId = get_id();
          let lobby: LobbyType = {
            id: lobbyId,
            state: "pre-game",
            name,
            totalPlace,
            playerList: new Array<Player>(),
            owner: owner.id,
            isPublic,
            mode,
          };
          // if (result.mode == "1vs1") {
          //   lobby.totalPlace = 2;
          // } else {
          //   lobby.totalPlace = result.place;
          // }

          let player = playerMap.get(owner.id);
          if (player === undefined) {
            console.log("player doesn't exist");
            return;
          }

          lobby.playerList.push(player);
          // if (player !== undefined) {
          // } else {
          //   playerMap.set(result.owner.id, result.owner);
          //   lobby.playerList.push(result.owner);
          // }

          lobbyMap.set(lobbyId, lobby);
          console.log("Lobby created : ", lobby);
          socket.join(lobbyId);
          player.lobbyId = lobbyId;
          if (lobby.isPublic) {
            io.emit("lobbies_update_create", lobbyMap.get(lobbyId));
          }
          response(lobbyId);
        } else {
          console.log("create_lobby payload : ", request);
          console.log("create_lobby : ", check);
        }
      }
    );
    socket.on("join_lobby", (result, response) => {
      if (typeof response !== "function") {
        console.log("join_lobby : player name is supposed to be a funtion");
        return;
      }

      let check = ArgJoinLobby.safeParse(result);
      if (check.success) {
        const { playerId, lobbyId } = check.data;
        let lobby = lobbyMap.get(lobbyId);
        let player = playerMap.get(playerId);
        if (
          lobby !== undefined &&
          player !== undefined &&
          player.lobbyId === null
        ) {
          if (lobby.playerList.length < lobby.totalPlace) {
            console.log("join");
            socket.join(result.lobbyId);

            player.lobbyId = lobbyId;

            lobby.playerList.push(player);

            io.emit("lobbies_update_join", { lobbyId, playerId });
            response({
              success: true,
              message: "Le lobby à été rejoins !",
            });
            console.log(lobby);
          } else {
            response({
              success: false,
              message: "Le lobby est déja plein !",
            });
          }
        } else {
          response({
            success: false,
            message: "Le lobby donné n'existe pas !",
          });
        }
      } else {
        console.log("join_lobby payload : ", result);
        console.log("join_lobby : ", check.error);
      }
    });

    socket.on("leave_lobby", (request) => {
      /**
       * @param request.roomId - Room of the player
       * @param request.playerId - ID of the player who have to be removed
       *
       */

      if (
        request !== undefined &&
        typeof request.roomId === "string" &&
        typeof request.playerId === "string"
      ) {
        let lobby = lobbyMap.get(request.roomId); // Lobby where the user is
        let playerList = lobbyMap.get(request.roomId)?.playerList; // playerList of this lobby

        if (playerList !== undefined && lobby !== undefined) {
          // Remove player from the playerList
          lobby.playerList = playerList.filter((player) => {
            return player.id !== request.playerId;
          });

          // If the player was the owner, change it
          if (
            lobby !== undefined &&
            lobby.owner == request.playerId &&
            playerList.length > 0
          ) {
            lobby.owner = playerList[0].id;
          }
        }

        // Leave the room
        socket.leave(request.roomId);
        if (playerMap.get(request.playerId) !== undefined) {
          playerMap.get(request.playerId)!.lobbyId = null;
        }
        io.emit("lobbies_update_leave", request);
        console.log("Joueur retiré");
      } else if (
        typeof request.roomId === "string" &&
        typeof request.playerId === "string"
      ) {
        console.log(
          "Mauvais type des paramètres d'un paramètre. roomId :",
          typeof request.roomId,
          "playerId :",
          typeof request.playerId
        );
      } else {
        console.log("Request undefined");
      }
    });

    socket.on(
      "create_player",
      (playerName, response: (payload: Player) => void) => {
        if (typeof playerName !== "string") {
          console.log("create_player : player name is supposed to be a string");
          return;
        }
        if (typeof response !== "function") {
          console.log("create_player : response is supposed to be function");
          return;
        }

        let playerId = get_id();
        let player = { id: playerId, name: playerName, lobbyId: null };
        playerMap.set(playerId, player);
        console.log(`player created : ${playerName} : ${playerId}`);
        io.emit("create_player_response", playerId);
        response(player);
      }
    );

    socket.on("update_word", (request, response) => {
      let check = ArgUpdateWord.safeParse(request);
      if (check.success) {
        let { word, lobbyId, playerId } = check.data;
        io.to(lobbyId).emit("update_word_broadcast", { word, playerId });
      } else {
        console.log("update_word payload : ", request);
        console.log("update_word : ", check);
      }
    });

    socket.on("start_game", (request, response) => {
      if (typeof response !== "function") {
        console.log("start_game : response is supposed to be a funtion");
        return;
      }

      let check = ArgStartGame.safeParse(request);
      if (check.success) {
        let { lobbyId, playerId } = check.data;
        let lobby = lobbyMap.get(lobbyId);
        if ( lobby?.owner !== playerId ) {
          console.log("start_game : only the owner can start the game");
          return;
        }
        let word = get_word();
        idToWord.set(lobbyId, word);            //the ID of the word is the same as the lobby



      } else {
        console.log("update_word payload : ", request);
        console.log("update_word : ", check);
      }
    });
  });

  // TODO : Disconnect ?
  io.on("disconnect", (socket) => {});

  return server;
};
