import { Server, Socket } from "socket.io";
import { get_id, get_word } from "../Endpoint/start_game";
import { idToWord } from "./server";
import {
  ArgCreateLobbyType,
  ArgJoinLobbyType,
  ArgLeaveLobbyType,
  ArgStartGameType,
  EventResponseFn,
  Game1vs1,
  Game1vs1Map,
  lobbyMap,
  LobbyType,
  PacketType,
  Player,
  playerMap,
} from "./type";
import { PUBLIC_LOBBIES } from "./utils";

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
    response({
      success: false,
      message: "Create_lobby n'a pas été effectué",
      data: null,
    });
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
    io.to(PUBLIC_LOBBIES).emit("lobbies_update_create", lobbyMap.get(lobbyId));
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

  io.to(PUBLIC_LOBBIES).to(lobbyId).emit("lobbies_update_join", { lobby });

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
  { playerId, lobbyId }: ArgLeaveLobbyType,
  response: EventResponseFn
) => {
  // console.log("Joueur retiré");
  let lobby = lobbyMap.get(lobbyId); // Lobby where the user is
  //   let playerList = lobbyMap.get(lobbyId)?.playerList; // playerList of this lobby

  if (lobby === undefined) {
    response({
      success: false,
      message: "leave_lobby : le lobby n'existe pas ! ",
      data: null,
    });
    return;
  }

  // Remove player from the playerList
  lobby.playerList = lobby.playerList.filter(
    (player) => player.id !== playerId
  );

  // If the player was the owner, change it
  if (lobby.owner === playerId) {
    if (lobby.playerList.length > 0) {
      lobby.owner = lobby.playerList[0].id;
    } else {
      lobby = undefined;
      lobbyMap.delete(lobbyId);
    }
  }

  console.log("Lobby map after delete", lobbyMap);

  // Change the lobbyId of the player
  let player = playerMap.get(playerId);
  if (player === undefined) {
    console.log("Player doesn't exist");
    response({
      success: false,
      message: "leave_lobby : player doesn't exist ! ",
      data: null,
    });
    return;
  }

  willNoLongerLeaveLobbyOnDisconnect(io, socket, { lobbyId, playerId });

  io.to(PUBLIC_LOBBIES)
    .to(lobbyId)
    .emit("lobbies_update_leave", {
      lobby: lobby === undefined ? null : lobby,
      lobbyId,
    });

  player.lobbyId = null;
  // Leave the room
  socket.leave(lobbyId);

  console.log("Joueur retiré");
  console.log("owner :", lobby?.owner);
  response({
    success: true,
    message: "leave_lobby : le joueur à été retiré ! ",
    data: null,
  });
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
  response({
    success: true,
    message: "Le joueur à bien été créé",
    data: player,
  });
};

export const startGameEvent = (
  io: Server,
  { lobbyId, playerId }: ArgStartGameType
) => {
  let lobby = lobbyMap.get(lobbyId);
  if (lobby === undefined) {
    console.log("start_game : lobby doesn't exist");
    return;
  }
  if (lobby.owner !== playerId) {
    console.log("start_game : only the owner can start the game");
    return;
  }

  lobby.state = "in-game";

  if (lobby.mode == "1vs1") {
    let word = get_word();
    let gameId = get_id();
    idToWord.set(gameId, word); //the ID of the word is the same as the lobby
    let game: Game1vs1 = {
      id: gameId,
      first_letter: word.charAt(0),
      length: word.length,
      nb_life: 6,
    };

    Game1vs1Map.set(gameId, game);
    io.to(lobbyId).emit("starting_game", game);
  } else if (lobby.mode == "battle-royale") {
    //TODO
  }
};

export const willLeaveLobbyOnDisconnect = (
  io: Server,
  socket: Socket,
  { playerId, lobbyId }: ArgLeaveLobbyType
) => {
  socket.on("disconnect", () => {
    leaveLobbyEvent(io, socket, { lobbyId, playerId }, () => {});
  });
};

export const willNoLongerLeaveLobbyOnDisconnect = (
  io: Server,
  socket: Socket,
  { playerId, lobbyId }: ArgLeaveLobbyType
) => {
  socket.removeListener("disconnect", () => {
    leaveLobbyEvent(io, socket, { lobbyId, playerId }, () => {});
  });
};
