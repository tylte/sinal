import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { get_id } from "../Endpoint/start_game";
import {
  ArgCreateLobbyType,
  lobbyMap,
  LobbyType,
  PacketType,
  Player,
  playerMap,
} from "./type";

export const createLobbyEvent = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket,
  { isPublic, mode, name, owner, place: totalPlace }: ArgCreateLobbyType,
  response: (payload: PacketType) => void
) => {
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

  let packet: PacketType = {
    success: true,
    message: "Create_lobby à été effectué sans errreur",
    data: lobbyId,
  };
  response(packet);
};
