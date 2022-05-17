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
  PacketType,
  Player,
} from "../src/utils/type";
import { assert } from "console";

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
  // test("Create player success case", (done) => {
  //   let playerId: string = "";
  //   clientSocket.emit("create_player", "bob", (res: Player) => {
  //     playerId = res.id;
  //     createLobbyArg.owner.id = res.id;
  //     expect(uuidValidateV4(res.id)).toBeTruthy();
  //     expect(Player.safeParse(res).success).toBeTruthy();
  //     expect(res.name).toBe("bob");
  //   });
  //   let createLobbyArg = {
  //     mode: "1vs1",
  //     place: 2,
  //     isPublic: true,
  //     owner: {
  //       name: "bob",
  //       id: playerId,
  //       lobbyId: null,
  //     },
  //     name: "lobby test",
  //   };
  //   clientSocket.emit("create_lobby", createLobbyArg, (res: PacketType) => {
  //     expect(uuidValidateV4(res.data)).toBeTruthy();
  //     done();
  //   });
  //   clientSocket.emit("leave_lobby", "bob");
  // });

  test("Create player wrong function sent", (done) => {
    clientSocket.emit("create_player", "bob", (qweqwe: string) => {
      // expect(uuidValidateV4(res.data.id)).toBeTruthy();
      // console.log(yep);
      done();
    });
    setTimeout(() => {
      done();
    }, 1000);
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
      (success: boolean, message: string) => {
        expect(success).toBeTruthy();
        done();
      }
    );
    clientSocket.emit("leave_lobby", "john");
  });
  */
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
      (success: boolean, message: string) => {}
    );
    clientSocket.emit("leave_lobby", "john");
    request(httpServer)
      .get("/list_lobbies")
      .expect(function(res:LobbyType[]) {
        res[0].playerList.forEach(function (value) {
          assert(value.name !== "john");
        })
      })
  });
  */
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
