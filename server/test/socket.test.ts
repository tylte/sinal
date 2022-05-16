import { io as connect, Socket as ClientSocket } from "socket.io-client";
import { getServer } from "../src/utils/server";
import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";
import { Server as HTTPServer } from "http";
import { sleep } from "../src/utils/utils";

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
  });

  test("Create player success case", (done) => {
    let playerId:string = "";
    clientSocket.emit("create_player", "bob", (res: string) => {
      playerId = res;
      expect(uuidValidateV4(res)).toBeTruthy();
    });
    let createLobbyArg = {
      mode: "1vs1",
      place: 2,
      isPublic: true,
      owner: {
        name: "bob",
        id: playerId,
      },
      name: "lobby test",
    };
    clientSocket.emit("create_lobby", createLobbyArg, (res: string) => {
      expect(uuidValidateV4(res)).toBeTruthy();
      done();
    });
    clientSocket.emit("leave_lobby", "bob");
  });
  test("Join lobby of player success case", (done) => {
    let id:string = "";
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
    clientSocket.emit("join_lobby", {lobbyId:id, playerId:"john"}, (success:boolean, message:string) => {
      expect(success).toBeTruthy();
      done();
    });
    clientSocket.emit("leave_lobby", "john");
  });
});
