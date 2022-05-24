import { Server, Socket } from "socket.io";
import { get_dictionary } from "../Endpoint/dictionary";
import { get_guess, LetterResult } from "../Endpoint/guess";
import { get_id, get_word } from "../Endpoint/start_game";
import { idToWord } from "./server";
import {
  ArgCreateLobbyType,
  ArgJoinLobbyType,
  ArgLeaveLobbyType,
  ArgStartGame1vs1Type,
  ArgStartGameBrType,
  ArgUpdateWord,
  EventResponseFn,
  Game1vs1,
  game1vs1Map,
  GameBr,
  gameBrMap,
  lobbyMap,
  LobbyType,
  PacketType,
  Player,
  PlayerBr,
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
  { lobbyId, playerId }: ArgStartGame1vs1Type
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
  // if (lobby.mode != "1vs1") {
  //   console.log("start_game_1vs1 : the mode selected on the lobby isn't 1vs1");
  //   return;
  // }

  let playerList = lobbyMap.get(lobbyId)?.playerList;
  if (playerList === undefined) {
    console.log("start_game_1vs1 : playerList of the lobby is undefined");
    return;
  }
  if (playerList.length < 2) {
    console.log("start_game_1vs1 : playerList is too short, lobby : ", lobby);
    return;
  }

  let playerOne = playerList[0];
  let playerTwo = playerList[1];
  if (playerOne === undefined || playerTwo === undefined) {
    console.log("start_game_1vs1 : there isn't two players in the lobby");
    return;
  }

  let gameId = get_id();
  lobby.state = "in-game";
  lobby.currentGameId = gameId;

  let word = get_word();
  idToWord.set(gameId, word); //the ID of the word is the same as the game
  let game: Game1vs1 = {
    playerOne: {
      id: playerOne.id,
      name: playerOne.name,
      nbLife: 6,
    },
    playerTwo: {
      id: playerTwo.id,
      name: playerTwo.name,
      nbLife: 6,
    },
    id: gameId,
    firstLetter: word.charAt(0),
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

export const guessWord1vs1Event = (
  io: Server,
  response: any,
  { word, gameId, playerId }: ArgUpdateWord
) => {
  let game = game1vs1Map.get(gameId);
  if (game === undefined) {
    console.log("guess_word_1vs1 : there is no game unsing this gameId");
    return;
  }

  let dico = get_dictionary();
  let correctWord = false;
  dico.forEach((w) => {
    if (w === word) correctWord = true;
  });
  if (!correctWord) {
    console.log("guess_word_1vs1 : this word isn't in the dictionary");
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

  if (player.nbLife === 0) {
    console.log("guess_word_1vs1 : player has no life left 💀");
    return;
  }

  let tab_res = get_guess(gameId, word, idToWord);
  response({
    success: true,
    message: "Le resultat du mot est renvoyé",
    data: tab_res,
  });
  player.nbLife--;
  io.to(gameId).emit("guess_word_broadcast", { tab_res, playerId, game });

  let win = true;
  tab_res.forEach((letter) => {
    if (letter !== LetterResult.RIGHT_POSITION) win = false;
  });

  if (win) {
    io.to(gameId).emit("wining_player_1vs1", playerId);
    io.to(gameId).socketsLeave(gameId);
    game1vs1Map.delete(gameId);
  } else if (game.playerOne.nbLife === 0 && game.playerTwo.nbLife === 0) {
    io.to(gameId).emit("draw_1vs1");
    io.to(gameId).socketsLeave(gameId);
    game1vs1Map.delete(gameId);
  }
};

export const startGameBrEvent = (
  io: Server,
  {
    lobbyId,
    playerId,
    eliminationRate,
    globalTime,
    timeAfterFirstGuess,
  }: ArgStartGameBrType
) => {
  let lobby = lobbyMap.get(lobbyId);
  if (lobby === undefined) {
    console.log("start_game_br : lobby doesn't exist");
    return;
  }
  if (lobby.owner !== playerId) {
    console.log("start_game_br : only the owner can start the game");
    return;
  }
  if (lobby.mode != "battle-royale") {
    console.log(
      "start_game_br : the mode selected on the lobby isn't battle-royale"
    );
    return;
  }

  let lobbyPlayerList = lobbyMap.get(lobbyId)?.playerList;
  if (lobbyPlayerList === undefined) {
    console.log("start_game_br : playerList of the lobby is undefined");
    return;
  }
  if (lobbyPlayerList.length < 2) {
    console.log("start_game_br : playerList is too short, lobby : ", lobby);
    return;
  }

  let gameId = get_id();
  lobby.state = "in-game";
  lobby.currentGameId = gameId;

  let playerArray = new Array<PlayerBr>();
  lobbyPlayerList.forEach((player) => {
    if (player !== undefined) {
      playerArray.push({
        id: player.id,
        name: player.name,
        nbLife: 6,
      });
    }
  });

  let word = get_word();
  idToWord.set(gameId, word);

  let game: GameBr = {
    playerList: playerArray,
    playerFound: new Array(),
    playersLastNextRound: Math.floor(
      playerArray.length * (1 - eliminationRate / 100)
    ),
    id: gameId,
    firstLetter: word.charAt(0),
    length: word.length,
    eliminationRate: eliminationRate,
    globalTime: globalTime,
    timeAfterFirstGuess: timeAfterFirstGuess,
  };

  gameBrMap.set(gameId, game);
  io.to(lobbyId).emit("starting_game", game);
  io.to(lobbyId).socketsJoin(gameId);
};

export const guessWordBrEvent = (
  io: Server,
  response: any,
  { word, gameId, playerId }: ArgUpdateWord
) => {
  let game = gameBrMap.get(gameId);
  if (game === undefined) {
    console.log("guess_word_br : there is no game unsing this gameId");
    return;
  }

  let dico = get_dictionary();
  let correctWord = false;
  dico.forEach((w) => {
    if (w === word) correctWord = true;
  });
  if (!correctWord) {
    console.log("guess_word_br : this word isn't in the dictionary");
    return;
  }

  let player: PlayerBr = { id: "", name: "", nbLife: 0 };
  game.playerList.forEach((p) => {
    if (p.id === playerId) {
      player = p;
    }
  });
  if (player.id === "") {
    console.log(
      "guess_word_br : there is no player in the game with this playerId"
    );
    return;
  }

  if (player.nbLife === 0) {
    console.log("guess_word_br : player has no life left 💀");
    return;
  }

  let tab_res = get_guess(gameId, word, idToWord);
  response({
    success: true,
    message: "Le resultat du mot est renvoyé",
    data: tab_res,
  });
  player.nbLife--;
  io.to(gameId).emit("guess_word_broadcast", { tab_res, playerId, game });

  let win = true;
  tab_res.forEach((letter) => {
    if (letter !== LetterResult.RIGHT_POSITION) win = false;
  });

  if (win) {
    if (game.playerFound.length === 0) {
      io.to(gameId).emit("first_winning_player_br", playerId);
    } else if (game.playerFound.length >= game.playersLastNextRound) {
      console.log("guess_word_br : player guessed too late");
      return;
    }

    game.playerFound.push(player);
    if (game.playerFound.length === game.playersLastNextRound) {
      game.playersLastNextRound = Math.floor(
        game.playersLastNextRound * (1 - game.eliminationRate / 100)
      );

      if (game.playersLastNextRound === 0) {
        io.to(gameId).emit("winning_player_br", playerId);
        io.to(gameId).socketsLeave(gameId);
      } else if (game.playersLastNextRound === 1) {
        //TODO finale (BO3 ?) il peut y avoir + de 2 joueurs en cas d'eliminationRate élevé /!\
      } else {
        let newWord = get_word();
        idToWord.set(gameId, newWord);
        game.firstLetter = newWord.charAt(0);
        game.length = newWord.length;
        game.playerFound = new Array();
        io.to(gameId).emit("next_word_br", game);
      }
    }
  }

  let noOneAlive = true;
  game.playerList.forEach((p) => {
    if (p.nbLife !== 0) {
      noOneAlive = false;
    }
  });
  if (noOneAlive && game.playerFound.length === 0) {
    io.to(gameId).emit("draw_br");
    let newWord = get_word();
    idToWord.set(gameId, newWord);
    game.firstLetter = newWord.charAt(0);
    game.length = newWord.length;
    game.playerFound = new Array();
    io.to(gameId).emit("next_word_br", game);
  }
};
