import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { date } from "zod";
import { get_dictionary } from "../Endpoint/dictionary";
import { get_guess } from "../Endpoint/guess";
import { get_lobbies, get_lobby_id } from "../Endpoint/lobbies";
import { get_id, get_word } from "../Endpoint/start_game";
import {
  createLobbyEvent,
  createPlayerEvent,
  guessWordEvent,
  joinLobbyEvent,
  leaveLobbyEvent,
  startGame1vs1Event,
  updateWordEvent,
} from "./events";
import {
  ArgCreateLobby,
  ArgJoinLobby,
  ArgStartGame,
  ArgUpdateWord,
  EventResponseFn,
  PacketType,
} from "./type";
import { PUBLIC_LOBBIES } from "./utils";

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

          console.log("create_lobby payload : ", request);
          console.log("create_lobby : ", check);
          response(packet);
        }
      }
    );

    socket.on("join_lobby", (result, response: EventResponseFn) => {
      if (typeof response !== "function") {
        console.log("join_lobby : response is supposed to be a function");
        return;
      }

      let check = ArgJoinLobby.safeParse(result);
      if (check.success) {
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

    socket.on(
      "leave_lobby",
      (request, response: (payload: PacketType) => void) => {
        if (typeof response !== "function") {
          console.log("leave_lobby : response is supposed to be a function");
          return;
        }
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
          leaveLobbyEvent(
            io,
            socket,
            {
              lobbyId: request.roomId,
              playerId: request.playerId,
            },
            response
          );
        } else {
          console.log("leave_lobby : bad request : ", request);
        }
      }
    );

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

    /**
     * start_game_1vs1
     * @param { lobbyId, playerId }
     * no response,
     * broadcast "starting_game" on all player in the lobby
     */
    socket.on("start_game_1vs1", (request, response) => {
      let check = ArgStartGame.safeParse(request);
      if (check.success) {
        startGame1vs1Event(io, check.data);
      } else {
        console.log("start_game_1vs1 payload : ", request);
        console.log("start_game_1vs1 : ", check);
      }
    });

    /**
     * update_word
     * @param { word, gameId, playerId }
     * no response,
     * broadcast "update_word_broadcast" on all player in the game
     */
    socket.on("update_word", (request, response) => {
      let check = ArgUpdateWord.safeParse(request);
      if (check.success) {
        updateWordEvent(io, check.data);
      } else {
        console.log("update_word payload : ", request);
        console.log("update_word : ", check);
      }
    });

    /**
     * guess_word_1vs1
     * @param { word, gameId, playerId }
     * response : array of LetterResult,
     * broadcast "guess_word_broadcast" on all player in the game
     */
    socket.on(
      "guess_word_1vs1",
      (req, response: (payload: PacketType) => void) => {
        if (typeof response !== "function") {
          console.log("guess_word_1vs1 : response is supposed to be function");
          return;
        }

        let check = ArgUpdateWord.safeParse(req); // Same arguments for update_word
        if (check.success) {
          guessWordEvent(io, response, check.data);
        } else {
          console.log("guess_word_1vs1 payload : ", req);
          console.log("guess_word_1vs1 : ", check);
        }
      }
    );

    /**
     * only use for tests
     * get_word
     * @param gameId
     * resopnse : the word soluce
     */
    socket.on(
      "get_word",
      (request, response: (payload: PacketType) => void) => {
        if (typeof response !== "function" || typeof request !== "string") {
          console.log(
            "get_word usage : request: {string} response: {function}"
          );
          return;
        }

        response({
          success: true,
          message: "here is the soluce",
          data: idToWord.get(request),
        });
      }
    );

    socket.on("join_public_lobbies", () => {
      socket.join(PUBLIC_LOBBIES);
    });

    socket.on("leave_public_lobbies", () => {
      socket.leave(PUBLIC_LOBBIES);
    });
  });

  return server;
};
