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
  ArgUpdateWord,
  EventResponseFn,
  lobbyMap,
  PacketType,
  playerMap,
} from "./type";
import {
  createLobbyEvent,
  createPlayerEvent,
  joinLobbyEvent,
  leaveLobbyEvent,
} from "./events";
import { table } from "console";

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
    // console.log(io.sockets);
    res.send(get_guess(id, word, idToWord));
  });

  io.on("connection", (socket) => {
    console.log("connected");

    socket.on(
      "create_lobby",
      (request, response: (payload: PacketType) => void) => {
        if (typeof response !== "function") {
          console.log("create_lobby : response is supposed to be a function");
          return;
        }

        let check = ArgCreateLobby.safeParse(request);
        if (check.success) {
          createLobbyEvent(io, socket, check.data, response);
        } else {
          let packet: PacketType = {
            success: false,
            message: "Create_lobby mauvais parametre envoye",
            data: null,
          };
          response(packet);
          console.log("create_lobby payload : ", request);
          console.log("create_lobby : ", check);
        }
      }
    );

    socket.on("join_lobby", (result, response: EventResponseFn) => {
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
              data: null,
            });
            console.log(lobby);
          } else {
            response({
              success: false,
              message: "Le lobby est déja plein !",
              data:null,
            });
          }
        } else {
          response({
            success: false,
            message: "Le lobby est déja plein !",
            data:null,
          });
        }
        joinLobbyEvent(io, socket, check.data, response);
      } else {
        response({
          success: false,
          message:
            "join_lobby : Les type donné ne sont pas les bons : " + check.error,
          data: null,
        });
        console.log("join_lobby payload : ", result);
        console.log("join_lobby : ", check.error);
      }
    });

    socket.on("leave_lobby", (request, response: (payload: PacketType) => void) => {
      /**
       * @param request.roomId - Room of the player
       * @param request.playerId - ID of the player who have to be removed
       *
       */
      console.log("Leave request : ", request);
      if (
        request !== undefined &&
        typeof request.roomId === "string" &&
        typeof request.playerId === "string"
      ) {
        leaveLobbyEvent(io, socket, {
          lobbyId: request.roomId,
          playerId: request.playerId,
        });
        response({
          success: true,
          message: "leave_lobby : le joueur à été retiré ! ",
          data:null,
        });
      } else {
        console.log("leave_lobby : bad request : ", request);
        response({
          success: false,
          message: "leave_lobby : le type ne correspond pas ! ",
          data:null,
        });
      }

    });

    socket.on(
      "create_player",
      (playerName, response: (payload: PacketType) => void) => {
        if (typeof response !== "function") {
          console.log("create_player : response is supposed to be function");
          return;
        }

        if (typeof playerName !== "string") {
          console.log("create_player : player name is supposed to be a string");
          response({
            success: false,
            message: "Veillez donner le nom du joueur",
            data: null,
          });
          return;
        }
        createPlayerEvent(io, playerName, response);
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

    socket.on("guess_word", (req, res) => {
      let check = ArgUpdateWord.safeParse(req); // Same arguments for update_word
      if (check.success) {
        let { word, lobbyId, playerId } = check.data;
        let tab_res = get_guess(lobbyId, word, idToWord);
        res.send(tab_res);
        io.to(lobbyId).emit("guess_word_broadcast", { tab_res, playerId });
      } else {
        console.log("update_word payload : ", req);
        console.log("update_word : ", check);
      }
    });
  });

  // TODO : Disconnect ?
  io.on("disconnect", (socket) => {});

  return server;
};
