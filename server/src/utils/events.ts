import { Server, Socket } from "socket.io";
import { get_id } from "../Endpoint/start_game";
import {
  ArgCreateLobbyType,
  ArgJoinLobbyType,
  ArgLeaveLobbyType,
  EventResponseFn,
  lobbyMap,
  LobbyType,
  PacketType,
  Player,
  playerMap,
} from "./type";

export const createLobbyEvent = (
  io: Server,
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

  // If the user created a lobby, he will leave it when deconnecting
  willLeaveLobbyOnDisconnect(io, socket, { lobbyId, playerId: player!.id });

  response(packet);
};

export const joinLobbyEvent = (
  io: Server,
  socket: Socket,
  { playerId, lobbyId }: ArgJoinLobbyType,
  response: EventResponseFn
) => {
  let lobby = lobbyMap.get(lobbyId);
  let player = playerMap.get(playerId);
  if (player === undefined) {
    response({
      success: false,
      message: "Le joueur n'existe pas !",
    });
    return;
  }
  if (lobby === undefined) {
    response({
      success: false,
      message: "Le lobby n'existe pas !",
    });
    return;
  }

  if (lobby.playerList.length >= lobby.totalPlace) {
    response({
      success: false,
      message: "Le lobby est déja plein !",
      data: null,
    });
    return;
  }

  console.log("join");
  socket.join(lobbyId);

  player.lobbyId = lobbyId;

  lobby.playerList.push(player);

  io.emit("lobbies_update_join", { lobbyId, playerId });

  // If the user joined a lobby, he will leave it when deconnecting
  willLeaveLobbyOnDisconnect(io, socket, { lobbyId, playerId });

  response({
    success: true,
    message: "Le lobby à été rejoins !",
  });
  console.log(lobby);
};

export const leaveLobbyEvent = (
  io: Server,
  socket: Socket,
  { playerId, lobbyId }: ArgLeaveLobbyType
) => {
  // console.log("Joueur retiré");
  let lobby = lobbyMap.get(lobbyId); // Lobby where the user is
  //   let playerList = lobbyMap.get(lobbyId)?.playerList; // playerList of this lobby

  if (lobby !== undefined) {
    let playerList = lobby.playerList;
    // Remove player from the playerList
    lobby.playerList = playerList.filter((player) => {
      return player.id !== playerId;
    });

    // If the player was the owner, change it
    if (lobby.owner === playerId) {
      if (lobby.playerList.length > 0) {
        lobby.owner = playerList[0].id;
      } else {
        lobbyMap.delete(lobbyId);
      }
    }
  }
  console.log("Lobby map after delete", lobbyMap);
  // Leave the room
  socket.leave(lobbyId);

  // Change the lobbyId of the player
  if (playerMap.get(playerId) !== undefined) {
    playerMap.get(playerId)!.lobbyId = null;
  }

  willNoLongerLeaveLobbyOnDisconnect(io, socket, { lobbyId, playerId });

  io.emit("lobbies_update_leave", {
    lobbyId,
    playerId: playerId,
  });

  console.log("Joueur retiré");
  console.log(lobby?.owner);
};

export const createPlayerEvent = (
  io: Server,
  playerName: string,
  response: EventResponseFn
) => {
  let playerId = get_id();
  let player = { id: playerId, name: playerName, lobbyId: null };
  playerMap.set(playerId, player);
  console.log(`player created : ${playerName} : ${playerId}`);
  io.emit("create_player_response", playerId);
  response({
    success: true,
    message: "Le joueur à bien été créé",
    data: player,
  });
};

export const willLeaveLobbyOnDisconnect = (
  io: Server,
  socket: Socket,
  { playerId, lobbyId }: ArgLeaveLobbyType
) => {
  socket.on("disconnect", () => {
    leaveLobbyEvent(io, socket, { lobbyId, playerId });
  });
};

export const willNoLongerLeaveLobbyOnDisconnect = (
  io: Server,
  socket: Socket,
  { playerId, lobbyId }: ArgLeaveLobbyType
) => {
  socket.removeListener("disconnect", () => {
    leaveLobbyEvent(io, socket, { lobbyId, playerId });
  });
};
