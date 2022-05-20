import { Server, Socket } from "socket.io";
import { get_guess, LetterResult } from "../Endpoint/guess";
import { get_id, get_word } from "../Endpoint/start_game";
import { idToWord } from "./server";
import {
  ArgCreateLobbyType,
  ArgJoinLobbyType,
  ArgLeaveLobbyType,
  ArgStartGameType,
  ArgUpdateWord,
  EventResponseFn,
  Game1vs1,
  game1vs1Map,
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
    currentGameId: null,
  };

  let player = playerMap.get(owner.id);
  if (player === undefined) {
    response({
      success: false,
      message: "Create_lobby n'a pas été effectué car le joueur n'existe pas",
      data: null,
    });
    return;
  }

  lobby.playerList.push(player);

  lobbyMap.set(lobbyId, lobby);
  console.log("Lobby created notif");
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
  socket.on("disconnect", () => {
    leaveLobbyEvent(io, socket, { lobbyId, playerId: player!.id }, response);
  });
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
  socket.join(lobbyId);

  player.lobbyId = lobbyId;

  lobby.playerList.push(player);

  io.to(PUBLIC_LOBBIES).to(lobbyId).emit("lobbies_update_join", { lobby });

  // If the user joined a lobby, he will leave it when deconnecting
  socket.on("disconnect", () => {
    leaveLobbyEvent(io, socket, { lobbyId, playerId: player!.id }, response);
  });

  response({
    success: true,
    message: "Le lobby à été rejoins !",
  });
};

export const leaveLobbyEvent = (
  io: Server,
  socket: Socket,
  { playerId, lobbyId }: ArgLeaveLobbyType,
  response: EventResponseFn
) => {
  let lobby = lobbyMap.get(lobbyId); // Lobby where the user is
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

  // Change the lobbyId of the player
  let player = playerMap.get(playerId);
  if (player === undefined) {
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

  console.log("Joueur retiré : ", playerId, " dans le lobby : ", lobbyId, "");
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

export const startGame1vs1Event = (
  io: Server,
  { lobbyId, playerId }: ArgStartGameType
) => {
  let lobby = lobbyMap.get(lobbyId);
  if (lobby === undefined) {
    console.log("start_game_1vs1 : lobby doesn't exist");
    return;
  }
  if (lobby.owner !== playerId) {
    console.log("start_game_1vs1 : only the owner can start the game");
    return;
  }
  if (lobby.mode != "1vs1") {
    console.log("start_game_1vs1 : the mode selected on the lobby isn't 1vs1");
    return;
  }

  let playerList = lobbyMap.get(lobbyId)?.playerList;
  if (playerList === undefined) {
    console.log("start_game_1vs1 : playerList of the lobby is undefined");
    return;
  }
  if (playerList.length < 2) {
    console.log("start_game_1vs1 : playerList is too short, lobby : ", lobby);
    return;
  }

  let playerOne = playerMap.get(playerList[0].id);
  let playerTwo = playerMap.get(playerList[1].id);
  if (playerOne === undefined || playerTwo === undefined) {
    console.log("start_game_1vs1 : there isn't two players in the lobby");
    return;
  }

  let gameId = get_id();
  lobby.state = "in-game";
  lobby.currentGameId = gameId;

  let word = get_word();
  idToWord.set(gameId, word); //the ID of the word is the same as the lobby
  let game: Game1vs1 = {
    playerOne: {
      id: playerOne.id,
      name: playerOne.name,
      nb_life: 6,
    },
    playerTwo: {
      id: playerTwo.id,
      name: playerTwo.name,
      nb_life: 6,
    },
    id: gameId,
    first_letter: word.charAt(0),
    length: word.length,
  };

  game1vs1Map.set(gameId, game);
  io.to(lobbyId).emit("starting_game", game);
  io.to(lobbyId).socketsJoin(gameId);
};

export const updateWordEvent = (
  io: Server,
  { word, gameId, playerId }: ArgUpdateWord
) => {
  let array = new Array<boolean>();
  let regex = /[A-Z]/i;
  for (let i = 0; i < word.length; i++) {
    array.push(regex.test(word.charAt(i).toUpperCase()));
  }

  io.to(gameId).emit("update_word_broadcast", { array, playerId });
};

export const guessWordEvent = (
  io: Server,
  response: any,
  { word, gameId, playerId }: ArgUpdateWord
) => {
  let game = game1vs1Map.get(gameId);
  if (game === undefined) {
    console.log("guess_word_1vs1 : there is no game unsing this gameId");
    return;
  }

  let player;
  if (game.playerOne.id === playerId) player = game.playerOne;
  else if (game.playerTwo.id === playerId) player = game.playerTwo;
  else {
    console.log(
      "guess_word_1vs1 : there is no player in the game with this playerId"
    );
    return;
  }

  if (player.nb_life === 0) {
    console.log("guess_word_1vs1 : player has no life left 💀");
    return;
  }

  let tab_res = get_guess(gameId, word, idToWord);
  response({
    success: true,
    message: "Le resultat du mot est renvoyé",
    data: tab_res,
  });
  player.nb_life--;
  io.to(gameId).emit("guess_word_broadcast", { tab_res, playerId, game });

  let win = true;
  tab_res.forEach((letter) => {
    if (letter !== LetterResult.RIGHT_POSITION) win = false;
  });

  if (win) {
    io.to(gameId).emit("wining_player_1vs1", playerId);
    io.to(gameId).socketsLeave(gameId);
  } else if (game.playerOne.nb_life === 0 && game.playerTwo.nb_life === 0) {
    io.to(gameId).emit("draw_1vs1");
    io.to(gameId).socketsLeave(gameId);
  }
};
