import { Server, Socket } from "socket.io";
import { map } from "zod";
import { dicoHasWord } from "../Endpoint/dictionary";
import { get_guess, LetterResult } from "../Endpoint/guess";
import { get_id, get_word } from "../Endpoint/start_game";
import {
  game1vs1Map,
  gameBrMap,
  lobbyMap,
  playerMap,
  timeoutMap,
} from "./maps";
import { idToWord } from "./server";
import {
  ArgCreateLobbyType,
  ArgGuessWordType,
  ArgJoinLobbyType,
  ArgLeaveLobbyType,
  ArgStartGame1vs1Type,
  ArgStartGameBrType,
  ArgUpdateWord,
  ChatMessageToSend,
  EventResponseFn,
  Game1vs1,
  GameBr,
  LobbyType,
  PacketType,
  Player,
  PlayerBr,
  ReceivedChatMessageType,
} from "./type";
import { PUBLIC_CHAT, PUBLIC_LOBBIES } from "./utils";

const NBLIFE = 6;

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
    lastGame: null,
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
    message: "Create_lobby a été effectué sans errreur",
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
    message: "Le lobby a été rejoins !",
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
    message: "leave_lobby : le joueur a été retiré ! ",
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
    message: "Le joueur a bien été créé",
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
  { lobbyId, playerId, globalTime, timeAfterFirstGuess }: ArgStartGame1vs1Type
) => {
  console.log("startGame1vs1Event");
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
  console.log("Mot à découvrir : ", word);
  idToWord.set(gameId, word); //the ID of the word is the same as the lobby
  let game: Game1vs1 = {
    playerOne: {
      id: playerOne.id,
      name: playerOne.name,
      nbLife: NBLIFE,
      hasWon: false,
    },
    playerTwo: {
      id: playerTwo.id,
      name: playerTwo.name,
      nbLife: NBLIFE,
      hasWon: false,
    },
    id: gameId,
    firstLetter: word.charAt(0),
    length: word.length,
    globalTime: globalTime,
    timeAfterFirstGuess: timeAfterFirstGuess,
  };

  lobby.lastGame = {
    gameMode: "1vs1",
    playerList: playerList,
    winner: undefined,
    wordsToGuess: [word],
    triesHistory: lobby.playerList.map(() => []),
  };

  let timeout = setTimeout(() => {
    tempsEcoule1vs1(io, game, lobby, word);
  }, globalTime);
  timeoutMap.set(gameId, timeout);

  game1vs1Map.set(gameId, game);
  game.endTime = Date.now() + globalTime;
  io.to(lobbyId).emit("starting_game_1vs1", game);
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
  { word, gameId, playerId, lobbyId }: ArgGuessWordType
) => {
  let game = game1vs1Map.get(gameId);
  if (game === undefined) {
    console.log("guess_word_1vs1 : there is no game unsing this gameId");
    return;
  }

  let player;
  let otherPlayer;
  if (game.playerOne.id === playerId) {
    player = game.playerOne;
    otherPlayer = game.playerTwo;
  } else if (game.playerTwo.id === playerId) {
    player = game.playerTwo;
    otherPlayer = game.playerOne;
  } else {
    console.log(
      "guess_word_1vs1 : there is no player in the game with this playerId"
    );
    return;
  }

  if (!dicoHasWord(word)) {
    console.log("guess_word_1vs1 : this word isn't in the dictionary");
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

  let lobby = lobbyMap.get(lobbyId);
  if (lobby !== undefined) {
    if (lobby.lastGame === undefined) {
      lobby.lastGame = {
        gameMode: "1vs1",
        playerList: lobby.playerList,
        winner: undefined,
        wordsToGuess: [word],
        triesHistory: lobby.playerList.map(() => [[0]]),
      };
    } else {
      for (let i = 0; i < lobby.playerList.length; i++) {
        if (lobby.playerList[i].id === playerId) {
          lobby.lastGame?.triesHistory[i].push(tab_res);
        }
      }
    }
    if (lobby.lastGame?.triesHistory === undefined) {
      return;
    }

    if (win) {
      player.hasWon = true;
      if (otherPlayer.hasWon) {
        if (player.nbLife > otherPlayer.nbLife) {
          io.to(gameId).emit("wining_player_1vs1", player.id);
          lobby.lastGame = {
            ...lobby.lastGame,
            winner: playerMap.get(playerId),
          };

          lobby.state = "pre-game";
          io.to(gameId).emit("ending_game", { lobby });
          io.to(gameId).socketsLeave(gameId);
        } else {
          io.to(gameId).emit("wining_player_1vs1", otherPlayer.id);
          lobby.lastGame = {
            ...lobby.lastGame,
            winner: playerMap.get(otherPlayer.id),
          };
          lobby.state = "pre-game";
          io.to(gameId).emit("ending_game", { lobby });
          io.to(gameId).socketsLeave(gameId);
        }
      } else if (player.nbLife >= otherPlayer.nbLife - 1) {
        io.to(gameId).emit("wining_player_1vs1", player.id);
        lobby.lastGame = {
          ...lobby.lastGame,
          winner: playerMap.get(otherPlayer.id),
        };
        lobby.state = "pre-game";
        io.to(gameId).emit("ending_game", { lobby });
        io.to(gameId).socketsLeave(gameId);
      } else {
        if (otherPlayer.nbLife <= player.nbLife + 1) {
          io.to(gameId).emit("wining_player_1vs1", player.id);
          io.to(gameId).socketsLeave(gameId);
        } else {
          let timeout = timeoutMap.get(gameId);
          if (timeout !== undefined) clearTimeout(timeout);
          timeout = setTimeout(() => {
            tempsEcoule1vs1(io, game, lobby, word);
          }, game.timeAfterFirstGuess);

          timeoutMap.set(gameId, timeout);

          if (
            game.endTime !== undefined &&
            game.endTime > Date.now() + game.timeAfterFirstGuess
          ) {
            game.endTime = game.timeAfterFirstGuess + Date.now();
          }
          io.to(gameId).emit("first_wining_player_1vs1", game);
        }
      }
    } else if (game.playerOne.nbLife === 0 && game.playerTwo.nbLife === 0) {
      io.to(gameId).emit("draw_1vs1");
      let lobby = lobbyMap.get(lobbyId);
      if (lobby) {
        lobby.lastGame = {
          gameMode: "1vs1",
          playerList: lobby.playerList,
          winner: undefined,
          wordsToGuess: [word],
          triesHistory: lobby.lastGame?.triesHistory || [[]],
        };
        lobby.state = "pre-game";
        io.to(gameId).emit("ending_game", { lobby });
      }
      io.to(gameId).socketsLeave(gameId);
      game1vs1Map.delete(gameId);
    }
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
  console.log("startGameBrEvent");
  let lobby = lobbyMap.get(lobbyId);
  if (lobby === undefined) {
    console.log("start_game_br : lobby doesn't exist");
    return;
  }
  if (lobby.owner !== playerId) {
    console.log("start_game_br : only the owner can start the game");
    return;
  }
  if (lobby.mode !== "battle-royale") {
    console.log(
      "start_game_br : the mode selected on the lobby isn't battle-royale"
    );
    return;
  }

  let lobbyPlayerList = lobby.playerList;
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
        nbLife: NBLIFE,
      });
    }
  });

  let game: GameBr = {
    playerList: playerArray,
    playerFound: new Array(),
    playersLastNextRound: Math.floor(
      playerArray.length * (1 - eliminationRate / 100)
    ),
    id: gameId,
    firstLetter: "a",
    length: 0,
    eliminationRate: eliminationRate,
    globalTime: globalTime,
    timeAfterFirstGuess: timeAfterFirstGuess,
    numberOfDrawStreak: 0,
  };

  newWordBr(io, game, globalTime);

  gameBrMap.set(gameId, game);
  io.to(lobbyId).emit("starting_game_br", game);
  io.to(lobbyId).socketsJoin(gameId);
};

export const guessWordBrEvent = (
  io: Server,
  response: any,
  { word, gameId, playerId }: ArgUpdateWord
) => {
  let timeout;
  let game = gameBrMap.get(gameId);
  if (game === undefined) {
    console.log("guess_word_br : there is no game unsing this gameId");
    return;
  }

  if (!dicoHasWord(word)) {
    console.log("guess_word_br : this word isn't in the dictionary : ", word);
    return;
  }

  let player = game.playerList.find((p) => p.id === playerId);
  if (player === undefined) {
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
  io.to(gameId).emit("guess_word_broadcast", { tab_res, playerId, game, word });

  let win = true;
  tab_res.forEach((letter) => {
    if (letter !== LetterResult.RIGHT_POSITION) win = false;
  });

  if (win) {
    if (game.playerFound.length === 0) {
      game.playerFound.push(player);
      game.numberOfDrawStreak = 0;

      setNewTimeout(io, game, game.timeAfterFirstGuess);

      io.to(gameId).emit("first_winning_player_br", game);
      if (game.playerFound.length === game.playersLastNextRound) {
        //the game is finished we delete the timeout
        timeout = timeoutMap.get(game.id);
        if (timeout !== undefined) clearTimeout(timeout);
        io.to(gameId).emit("winning_player_br", playerId);
        io.to(gameId).socketsLeave(gameId);
      }
    } else if (game.playerFound.length >= game.playersLastNextRound) {
      console.log("guess_word_br : player guessed too late");
      return;
    } else {
      game.playerFound.push(player);

      if (game.playerFound.length === game.playersLastNextRound) {
        game.playersLastNextRound = Math.floor(
          game.playersLastNextRound * (1 - game.eliminationRate / 100)
        );

        if (game.playersLastNextRound === 0) {
          //the game is finished we delete the timeout
          timeout = timeoutMap.get(game.id);
          if (timeout !== undefined) clearTimeout(timeout);
          io.to(gameId).emit("winning_player_br", playerId);
          io.to(gameId).socketsLeave(gameId);
        } else if (game.playersLastNextRound === 1) {
          game.playerList = game.playerFound;
          game.playerFound = new Array();
          newWordBr(io, game, game.globalTime);

          io.to(gameId).emit("next_word_br", game);
          //TODO finale (BO3 ?) il peut y avoir + de 2 joueurs en cas d'eliminationRate élevé /!\
        } else {
          game.playerList = game.playerFound;
          game.playerFound = new Array();
          newWordBr(io, game, game.globalTime);

          io.to(gameId).emit("next_word_br", game);
        }
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
    if (game.numberOfDrawStreak < 3) {
      game.numberOfDrawStreak++;
      io.to(gameId).emit("draw_br");

      game.playerFound = new Array();

      newWordBr(io, game, game.globalTime);

      io.to(gameId).emit("next_word_br", game);
    } else {
      //the game is finished we delete the timeout
      timeout = timeoutMap.get(game.id);
      if (timeout !== undefined) clearTimeout(timeout);
      io.to(gameId).emit("end_of_game_draw", game);
    }
  }
};

const tempsEcouleBr = (game: GameBr | undefined, io: Server) => {
  if (game !== undefined) {
    let timeout = timeoutMap.get(game.id);
    if (timeout !== undefined) clearTimeout(timeout);
    newWordBr(io, game, game.globalTime);

    if (game.playerFound.length === 0) {
      if (game.numberOfDrawStreak < 3) {
        game.numberOfDrawStreak++;
        game.playerList.forEach((p) => {
          p.nbLife = NBLIFE;
        });

        io.to(game.id).emit("draw_br");
        io.to(game.id).emit("next_word_br", game);
      } else {
        //the game is finished we delete the timeout
        timeout = timeoutMap.get(game.id);
        if (timeout !== undefined) clearTimeout(timeout);
        io.to(game.id).emit("end_of_game_draw", game);
      }
    } else if (game.playerFound.length === 1) {
      io.to(game.id).emit("winning_player_br", game.playerFound[0].id);
      //the game is finished we delete the timeout
      timeout = timeoutMap.get(game.id);
      if (timeout !== undefined) clearTimeout(timeout);
      io.to(game.id).socketsLeave(game.id);
    } else {
      game.playersLastNextRound = Math.floor(
        game.playersLastNextRound * (1 - game.eliminationRate / 100)
      );
      game.playerList = game.playerFound;
      game.playerFound = new Array();

      game.playerList.forEach((p) => {
        p.nbLife = NBLIFE;
      });

      io.to(game.id).emit("next_word_br", game);
    }
  }
};

const newWordBr = (io: Server, game: GameBr | undefined, newTime: number) => {
  if (game !== undefined) {
    let time = timeoutMap.get(game.id);
    if (time !== undefined) {
      clearTimeout(time);
    }
    game.endTime = undefined;
    let newWord = get_word();
    console.log("Mot à découvrir : ", newWord);
    idToWord.set(game.id, newWord);
    game.firstLetter = newWord.charAt(0);
    game.length = newWord.length;

    game.playerList.forEach((p) => {
      p.nbLife = NBLIFE;
    });

    setNewTimeout(io, game, newTime);
  }
};

const setNewTimeout = (
  io: Server,
  game: GameBr | undefined,
  newTime: number
) => {
  if (game !== undefined) {
    if (game.endTime === undefined || game.endTime > Date.now() + newTime) {
      let timeout = timeoutMap.get(game.id);
      if (timeout !== undefined) clearTimeout(timeout);

      timeout = setTimeout(() => {
        tempsEcouleBr(game, io);
      }, newTime);

      game.endTime = Date.now() + newTime;
      timeoutMap.set(game.id, timeout);
    }
  }
};

const tempsEcoule1vs1 = (
  io: Server,
  game: Game1vs1 | undefined,
  lobby?: LobbyType | undefined,
  word?: string
) => {
  if (game !== undefined && lobby !== undefined && word) {
    if (game.playerOne.hasWon && !game.playerTwo.hasWon) {
      io.to(game.id).emit("wining_player_1vs1", game.playerOne.id);
      lobby.lastGame = {
        gameMode: "1vs1",
        playerList: lobby.playerList,
        winner: playerMap.get(game.playerOne.id),
        wordsToGuess: [word],
        triesHistory: lobby.lastGame?.triesHistory || [[]],
      };
      lobby.state = "pre-game";
      io.to(game.id).emit("ending_game", { lobby });
    } else if (!game.playerOne.hasWon && game.playerTwo.hasWon) {
      io.to(game.id).emit("wining_player_1vs1", game.playerTwo.id);
      lobby.lastGame = {
        gameMode: lobby.mode,
        playerList: lobby.playerList,
        winner: playerMap.get(game.playerTwo.id),
        wordsToGuess: [word],
        triesHistory: lobby.lastGame?.triesHistory || [[]],
      };
      lobby.state = "pre-game";
      io.to(game.id).emit("ending_game", { lobby });
    } else {
      io.to(game.id).emit("draw_1vs1");
      lobby.lastGame = {
        gameMode: lobby.mode,
        playerList: lobby.playerList,
        winner: undefined,
        wordsToGuess: [word],
        triesHistory: lobby.lastGame?.triesHistory || [[]],
      };
      lobby.state = "pre-game";
      io.to(game.id).emit("ending_game", { lobby });
    }
    io.to(game.id).socketsLeave(game.id);
  }
};

export const sendChatMessage = (
  io: Server,
  { content, playerId }: ReceivedChatMessageType
) => {
  const player = playerMap.get(playerId);

  if (!player) {
    console.log("send_chat_message : player doesn't seem to exist");
    return;
  }

  let messageId = get_id();

  let messageToSend: ChatMessageToSend = {
    author: player.name,
    content,
    id: messageId,
  };

  io.to(PUBLIC_CHAT).emit("broadcast_message", messageToSend);
};
