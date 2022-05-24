import { io as connect, Socket as ClientSocket } from "socket.io-client";
import { getServer } from "../src/utils/server";
import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";
import { Server as HTTPServer } from "http";
import request from "supertest";
import { sleep } from "../src/utils/utils";
import {
  ArgCreateLobby,
  LobbyType,
  Packet,
  PacketType,
  Player,
} from "../src/utils/type";
import { assert } from "console";
import { fail } from "assert";
import { LetterResult } from "../src/Endpoint/guess";

const uuidValidateV4 = (uuid: string) => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};

describe("Web socket testing", () => {
  let clientSocket: ClientSocket, httpServer: HTTPServer;
  let otherClientSocket: ClientSocket;

  beforeAll((done) => {
    httpServer = getServer();

    const port = 4010;

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
  test("Create lobby + create player success case", (done) => {
    let playerId: string = "";
    clientSocket.emit("create_player", "bob", (res: PacketType) => {
      try {
        playerId = res.data.id;
        createLobbyArg.owner.id = res.data.id;
        expect(uuidValidateV4(res.data.id)).toBeTruthy();
        expect(Packet.safeParse(res).success).toBeTruthy();
        expect(res.data.name).toBe("bob");
        clientSocket.emit("create_lobby", createLobbyArg, (res: PacketType) => {
          try {
            expect(res.success).toBeTruthy();
            expect(uuidValidateV4(res.data)).toBeTruthy();
            done();
          } catch (e) {
            done(e);
          }
        });
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
        id: playerId,
        lobbyId: null,
      },
      name: "lobby test",
    };
  });
  test("Create lobby success case owner doesn't exist", (done) => {
    let playerId: string = "";
    let createLobbyArg = {
      mode: "1vs1",
      place: 2,
      isPublic: true,
      owner: {
        name: "bob",
        id: playerId,
        lobbyId: null,
      },
      name: "lobby test",
    };
    clientSocket.emit("create_player", "bob", (res: PacketType) => {
      try {
        playerId = res.data.id;
        expect(uuidValidateV4(res.data.id)).toBeTruthy();
        expect(Packet.safeParse(res).success).toBeTruthy();
        expect(res.data.name).toBe("bob");
        clientSocket.emit("create_lobby", createLobbyArg, (res: PacketType) => {
          try {
            expect(res.success).not.toBeTruthy();
            done();
          } catch (e) {
            done(e);
          }
        });
      } catch (e) {
        done(e);
      } finally {
      }
    });
  });
  test("Join lobby of player success case", (done) => {
    let createLobbyArg = {
      mode: "1vs1",
      place: 2,
      isPublic: true,
      owner: {
        name: "bob",
        id: "",
        lobbyId: null,
      },
      name: "lobby test",
    };
    clientSocket.emit("create_player", "bob", (player: PacketType) => {
      createLobbyArg.owner.id = player.data.id;
      clientSocket.emit("create_lobby", createLobbyArg, (lobby: PacketType) => {
        clientSocket.emit("create_player", "john", (res: PacketType) => {
          clientSocket.emit(
            "join_lobby",
            { lobbyId: lobby.data, playerId: res.data.id },
            (join: PacketType) => {
              try {
                expect(join.success).toBeTruthy();
                done();
              } catch (e) {
                done(e);
              }
            }
          );
        });
      });
    });
  });
  test("Join lobby a lobby with a false lobbyId or false playerId ", (done) => {
    let createLobbyArg = {
      mode: "1vs1",
      place: 2,
      isPublic: true,
      owner: {
        name: "bob",
        id: "",
        lobbyId: null,
      },
      name: "lobby test",
    };
    clientSocket.emit("create_player", "bob", (player: PacketType) => {
      createLobbyArg.owner.id = player.data.id;
      clientSocket.emit("create_lobby", createLobbyArg, (lobby: PacketType) => {
        clientSocket.emit("create_player", "john", (res: PacketType) => {
          clientSocket.emit(
            "join_lobby",
            { lobbyId: "lobby.data", playerId: res.data.id },
            (join: PacketType) => {
              try {
                expect(join.success).not.toBeTruthy();
              } catch (e) {
                done(e);
              }
            }
          );
          clientSocket.emit(
            "join_lobby",
            { lobbyId: lobby.data, playerId: "res.data.id" },
            (join: PacketType) => {
              try {
                expect(join.success).not.toBeTruthy();
                done();
              } catch (e) {
                done(e);
              }
            }
          );
        });
      });
    });
  });

  test("Guess Word of a player in a 1vs1 game", (done) => {
    let createLobbyArg = {
      mode: "1vs1",
      place: 2,
      isPublic: true,
      owner: {
        name: "bob",
        id: "",
        lobbyId: null,
      },
      name: "lobby test",
    };
    clientSocket.emit("create_player", "Joueur 1", (player1: PacketType) => {
      createLobbyArg.owner.id = player1.data.id;
      clientSocket.emit("create_lobby", createLobbyArg, (lobby: PacketType) => {
        otherClientSocket.emit(
          "create_player",
          "Joueur 2",
          (player2: PacketType) => {
            otherClientSocket.emit("join_lobby", {
              lobbyId: lobby.data,
              playerId: player2.data.id,
            });
            clientSocket.emit("start_game_1vs1", {
              lobbyId: lobby.data,
              playerId: player1.data.id,
            });
            clientSocket.emit("guess_word_1vs1", {
              word: "Coucou",
              lobbyId: lobby.data,
              playerId: player1.data.id,
            });
            done();
          }
        );
      });
    });
  });
  test("Leave lobby of player success case", (done) => {
    let createLobbyArg = {
      mode: "1vs1",
      place: 2,
      isPublic: true,
      owner: {
        name: "bob",
        id: "",
        lobbyId: null,
      },
      name: "lobby test",
    };
    clientSocket.emit("create_player", "bob", (player: PacketType) => {
      createLobbyArg.owner.id = player.data.id;
      clientSocket.emit("create_lobby", createLobbyArg, (lobby: PacketType) => {
        clientSocket.emit("create_player", "john", (res: PacketType) => {
          clientSocket.emit(
            "join_lobby",
            { lobbyId: lobby.data, playerId: res.data.id },
            () => {
              clientSocket.emit(
                "leave_lobby",
                { roomId: lobby.data, playerId: res.data.id },
                (leave: PacketType) => {
                  try {
                    expect(leave.success).toBeTruthy();
                    done();
                  } catch (e) {
                    done(e);
                  }
                }
              );
            }
          );
        });
      });
    });
  });
  test("Leave lobby with a false lobbyId", (done) => {
    let createLobbyArg = {
      mode: "1vs1",
      place: 2,
      isPublic: true,
      owner: {
        name: "bob",
        id: "",
        lobbyId: null,
      },
      name: "lobby test",
    };
    clientSocket.emit("create_player", "bob", (player: PacketType) => {
      createLobbyArg.owner.id = player.data.id;
      clientSocket.emit("create_lobby", createLobbyArg, (lobby: PacketType) => {
        clientSocket.emit("create_player", "john", (res: PacketType) => {
          clientSocket.emit(
            "join_lobby",
            { lobbyId: lobby.data, playerId: res.data.id },
            () => {
              clientSocket.emit(
                "leave_lobby",
                { roomId: "lobby.data", playerId: res.data.id },
                (leave: PacketType) => {
                  try {
                    expect(leave.success).not.toBeTruthy();
                    done();
                  } catch (e) {
                    done(e);
                  }
                }
              );
            }
          );
        });
      });
    });
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
                });
              }
            );

            clientSocket.on("starting_game_br", (game) => {
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
