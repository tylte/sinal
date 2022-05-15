import { io as connect, Socket as ClientSocket } from "socket.io-client";
import { getServer } from "../src/utils/server";
import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";
import { Server as HTTPServer } from "http";

const uuidValidateV4 = (uuid: string) => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};

describe("Web socket testing", () => {
  let clientSocket: ClientSocket, httpServer: HTTPServer;

  beforeAll((done) => {
    httpServer = getServer();

    const port = 4010;
    httpServer.listen(port, () => {
      clientSocket = connect(`http://localhost:${port}`);

      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    httpServer.close();
    clientSocket.close();
  });

  test("Create player success case", (done) => {
    clientSocket.on("create_player_response", (arg) => {
      expect(uuidValidateV4(arg)).toBeTruthy();
      done();
    });
    clientSocket.emit("create_player", "bob", (res: string) => {
      expect(res).toBe("Rly !?");
    });
  });
});
