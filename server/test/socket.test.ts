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
  /*
  test("Create lobby + create player success case", (done) => {
    let playerId: string = "";
    clientSocket.emit("create_player", "bob", (res: PacketType) => {
      try {
        playerId = res.data.id;
        createLobbyArg.owner.id = res.data.id;
        expect(uuidValidateV4(res.data.id)).toBeTruthy();
        expect(Packet.safeParse(res).success).toBeTruthy();
        expect(res.data.name).toBe("bob");
        console.log(res);
        clientSocket.emit("create_lobby", createLobbyArg, (res: PacketType) => {
          try {
            expect(res.success).toBeTruthy();
            expect(uuidValidateV4(res.data)).toBeTruthy();
            done();
          } catch(e) {
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
          } catch(e) {
            done(e);
          }
        });
      } catch (e) {
        done(e);
      }
      finally {
        
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
              }catch(e) {
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
  */
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
  /*
  test("Join lobby of player success case", (done) => {
    let id: string = "";
    clientSocket.emit("create_player", "bob", (res: string) => {
      createLobbyArg.owner.id = res;
    });
    let createLobbyArg = {
      mode: "1vs1",
      place: 2,
      isPublic: true,
      owner: {
        name: "bob",
        id: "",
      },
      name: "lobby test",
    };
    clientSocket.emit("create_lobby", createLobbyArg, (res: string) => {
      id = res;
    });
    clientSocket.emit("leave_lobby", "bob");
    clientSocket.emit("create_player", "john");
    clientSocket.emit(
      "join_lobby",
      { lobbyId: id, playerId: "john" },
      () => {}
    );
    clientSocket.emit("update_word", "tes", (res: boolean[]) => {
      for (let i = 0; i < 3; ++i) {
        expect(res[i]).toBeTruthy();
      }
      done();
    });
  });
  */
});
