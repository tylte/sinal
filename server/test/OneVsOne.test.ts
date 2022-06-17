import { io as connect, Socket as ClientSocket } from "socket.io-client";
import { getServer } from "../src/utils/server";
import { Server as HTTPServer } from "http";
import {
  ArgCreateLobbyType,
  ArgGuessWordType,
  PacketType,
} from "../src/utils/type";
import { LetterResult } from "../src/Endpoint/guess";

describe("testing 1vs1", () => {
  let clientSocket: ClientSocket, httpServer: HTTPServer;
  let otherClientSocket: ClientSocket;

  beforeAll((done) => {
    httpServer = getServer();

    const port = 4011;

    httpServer.listen(port, () => {
      clientSocket = connect(`http://localhost:${port}`);
      otherClientSocket = connect(`http://localhost:${port}`);

      clientSocket.on("connect", done);
      otherClientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    httpServer.close();
    clientSocket.close();
    otherClientSocket.close();
  });

  test("Normal game of 1vs1", (done) => {
    clientSocket.emit("create_player", "Bob", (playerOne: PacketType) => {
      clientSocket.on("winning_game_1vs1", (winner) => {
        try {
          expect(winner.id).toBe(playerOne.data.id);
          done();
        } catch (e) {
          done(e);
        }
      });

      let createLobbyArg: ArgCreateLobbyType = {
        mode: "1vs1",
        place: 2,
        isPublic: true,
        owner: {
          name: "bob",
          id: playerOne.data.id,
          lobbyId: null,
        },
        name: "lobby test",
        nbRounds: 1,
        nbLife: 6,
        globalTime: 1000,
        timeAfterFirstGuess: 500,
        eliminationRate: 100,
      };
      clientSocket.emit("create_lobby", createLobbyArg, (lobby: PacketType) => {
        otherClientSocket.emit(
          "create_player",
          "John",
          (playerTwo: PacketType) => {
            otherClientSocket.emit(
              "join_lobby",
              { lobbyId: lobby.data, playerId: playerTwo.data.id },
              () => {
                clientSocket.emit("start_game_1vs1", {
                  lobbyId: lobby.data,
                  playerId: playerOne.data.id,
                  globalTime: 1000,
                  timeAfterFirstGuess: 500,
                });
              }
            );

            clientSocket.on("starting_game_1vs1", (game) => {
              clientSocket.emit("get_word", game.id, (soluce: PacketType) => {
                let testWord: string = "etre-la";
                otherClientSocket.emit(
                  "guess_word_1vs1",
                  {
                    word: testWord,
                    gameId: game.id,
                    playerId: playerTwo.data.id,
                    lobbyId: lobby.data,
                  },
                  (tab_res: PacketType) => {
                    let array = Array<LetterResult>(testWord.length).fill(
                      LetterResult.RIGHT_POSITION
                    );

                    try {
                      expect(tab_res.data).not.toStrictEqual(array);
                    } catch (e) {
                      done(e);
                    }
                  }
                );
                clientSocket.emit(
                  "guess_word_1vs1",
                  {
                    word: soluce.data,
                    gameId: game.id,
                    playerId: playerOne.data.id,
                    lobbyId: lobby.data,
                  },
                  () => {}
                );
              });
            });
          }
        );
      });
    });
  });
});
