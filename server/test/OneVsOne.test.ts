import { io as connect, Socket as ClientSocket } from "socket.io-client";
import { getServer } from "../src/utils/server";
import { Server as HTTPServer } from "http";
import { PacketType } from "../src/utils/type";
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
      clientSocket.on("wining_player_1vs1", (playerId) => {
        try {
          expect(playerId).toBe(playerOne.data.id);
          done();
        } catch (e) {
          done(e);
        }
      });

      let createLobbyArg = {
        mode: "1vs1",
        place: 2,
        isPublic: true,
        owner: {
          name: "bob",
          id: playerOne.data.id,
          lobbyId: null,
        },
        name: "lobby test",
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
                  globalTime: 5000,
                  timeAfterFirstGuess: 1000,
                });
              }
            );

            clientSocket.on("starting_game", (game) => {
              clientSocket.emit("get_word", game.id, (soluce: PacketType) => {
                let testWord: string = soluce.data;
                if (testWord[testWord.length - 1] !== "W")
                  testWord = testWord.slice(0, testWord.length - 1) + "W";
                else testWord = testWord.slice(0, testWord.length - 1) + "Z";
                otherClientSocket.emit(
                  "guess_word_1vs1",
                  {
                    word: testWord,
                    gameId: game.id,
                    playerId: playerTwo.data.id,
                  },
                  (tab_res: PacketType) => {
                    let array = Array<LetterResult>(testWord.length).fill(
                      LetterResult.RIGHT_POSITION
                    );
                    array[array.length - 1] = LetterResult.NOT_FOUND;

                    try {
                      expect(tab_res.data).toStrictEqual(array);
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
