import { ToastId, UseToastOptions } from "@chakra-ui/react";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import {
  BrGameInfo,
  BrGameState,
  Game1vs1,
  LetterResult,
  Lobby,
  Packet,
  Player,
  TriesHistory,
  UpdateLobbyJoinPayload,
  UpdateLobbyLeavePayload,
} from "./types";

export const guessWord = async (
  word: string,
  id: string
): Promise<LetterResult[]> => {
  try {
    const { data } = await axios.post<LetterResult[]>(
      "http://localhost:4000/guess",
      { word, id }
    );

    return data;
  } catch (e) {
    console.error(e);
  }
  // Error
  return [];
};

export const guessWordMulti = async (
  word: string,
  lobbyId: string,
  playerId: string,
  socket: Socket | null,
  response: (response: Packet) => void
) => {
  socket?.emit(
    "guess_word",
    {
      word,
      lobbyId,
      playerId,
    },
    response
  );
};

export const guessWordBr = (
  word: string,
  gameId: string | undefined,
  playerId: string,
  socket: Socket | null,
  response: (response: Packet) => void
) => {
  if (gameId !== undefined) {
    socket?.emit(
      "guess_word_br",
      {
        word,
        gameId,
        playerId,
      },
      response
    );
  } else {
    console.log("guessWordBr error gameId undefined");
  }
};
export const awaitResult = async (
  resultOnChange: boolean
): Promise<Boolean> => {
  while (!resultOnChange) {
    console.log("premise enter");
  }
  return true;
};

export const addSocketConnectionEvent = (
  socket: Socket | null,
  setIsConnected: Dispatch<SetStateAction<boolean>>
) => {
  socket?.on("connect", () => {
    setIsConnected(true);
  });
  socket?.on("disconnect", () => {
    setIsConnected(false);
  });
};

export const addLobbiesEvent = (
  socket: Socket | null,
  setLobbies: Dispatch<SetStateAction<Lobby[]>>
) => {
  socket?.on("lobbies_update_create", (lobby: Lobby) => {
    console.log("Lobby created notif");
    setLobbies((lobbies) => [...lobbies, lobby]);
  });

  socket?.on(
    "lobbies_update_join",
    ({ lobby: lobbyChanged }: UpdateLobbyJoinPayload) => {
      if (!lobbyChanged) {
        return;
      }

      console.log("lobbies_update_join notif");
      setLobbies((lobbies) => {
        let newLobbies = lobbies.map((lobby) => {
          if (lobby.id === lobbyChanged.id) {
            return lobbyChanged;
          } else {
            return lobby;
          }
        });
        return newLobbies;
      });
    }
  );

  socket?.on(
    "lobbies_update_leave",
    ({ lobbyId, lobby: changedLobby }: UpdateLobbyLeavePayload) => {
      if (!lobbyId) {
        return;
      }

      setLobbies((lobbies) => {
        let newLobbies = lobbies.slice();
        if (!changedLobby) {
          newLobbies = newLobbies.filter((lobby) => lobby.id !== lobbyId);
        } else {
          newLobbies = lobbies.map((lobby) => {
            if (lobby.id === lobbyId) {
              return changedLobby;
            } else {
              return lobby;
            }
          });
        }
        return newLobbies;
      });
    }
  );

  socket?.emit("join_public_lobbies");
};

export const addPreGameEvent = (socket: Socket | null) => {
  socket?.on("starting_game", (gameId: number) => {
    console.log("starting game : " + gameId);
  });
};

export const removeLobbiesEvent = (socket: Socket | null) => {
  socket?.removeListener("lobbies_update_create");
  socket?.removeListener("lobbies_update_join");
  socket?.removeListener("lobbies_update_leave");
  socket?.emit("leave_public_lobbies");
};

export const addSpecificLobbiesEvent = (
  socket: Socket,
  lobbyId: string,
  setLobby: Dispatch<SetStateAction<Lobby | null>>,
  setGameState: Dispatch<SetStateAction<Game1vs1 | BrGameInfo | null>>,
) => {
  socket.on("starting_game", (game: Game1vs1) => {
    console.log("starting-game-1vs1");
    setGameState(game);
    //FIXME : Mettre le statut du lobby en "in-game" côté serveur
    setLobby((lobby) => {
      if (lobby === null) {
        return null;
      } else {
        return { ...lobby, state: "in-game" };
      }
    });
  });
  socket.on("starting_game_Br", (game: BrGameInfo) => {
    console.log("starting-game-Br");
    setGameState(game);
    //FIXME : Mettre le statut du lobby en "in-game" côté serveur
    setLobby((lobby) => {
      if (lobby === null) {
        return null;
      } else {
        return { ...lobby, state: "in-game" };
      }
    });
  });
  socket.on(
    "lobbies_update_join",
    ({ lobby: changedLobby }: UpdateLobbyJoinPayload) => {
      if (!changedLobby) {
        console.log("lobbies_update_join notif, lobbyId: ", lobbyId);
        return;
      }
      if (changedLobby.id !== lobbyId) {
        return;
      }
      setLobby(changedLobby);
    }
  );

  socket.on(
    "lobbies_update_leave",
    ({
      lobby: changedLobby,
      lobbyId: changedLobbyId,
    }: UpdateLobbyLeavePayload) => {
      if (!changedLobby) {
        return;
      }
      console.log("leave lobby ping", { changedLobbyId, changedLobby });
      setLobby(changedLobby);
    }
  );
};

export const removeSpecificLobbyEvent = (socket: Socket | null) => {
  socket?.removeListener("lobbies_update_join");
  socket?.removeListener("lobbies_update_leave");
  socket?.removeListener("starting_game");
};

export const getSpecificLobby = (
  lobbyId: string,
  setLobby: Dispatch<SetStateAction<Lobby | null>>,
  socket: Socket,
  toast: (options?: UseToastOptions | undefined) => ToastId | undefined,
  player: Player
) => {
  axios
    .get<Lobby>(`http://localhost:4000/list_lobbies/${lobbyId}`)
    .then(({ data }) => {
      if (data !== null) {
        setLobby(data);

        if (player.id !== data.owner) {
          socket.emit(
            "join_lobby",
            {
              lobbyId: lobbyId,
              playerId: player?.id,
            },
            (response: Packet) => {
              toast({
                description: response.message,
                status: response.success ? "success" : "error",
                duration: 3000,
                isClosable: true,
              });
            }
          );
        }
      }
    });
};
export const addUpdateWordBroadcast = (socket: Socket) => {
  socket.on("update_word_broadcast", (arg) => {
    console.log("update_word_broadcast : " + arg);
  });
};
export const addGuessWordBrBroadcast = async (
  socket: Socket | null,
  playerId: string,
  setGameState: React.Dispatch<React.SetStateAction<BrGameState[]>>
) => {
  socket?.on("guess_word_broadcast", (arg) => {
    if (arg.playerId !== playerId) {
      console.log("guess_word_broadcast arg : ", arg);
      // console.log("success guess_word_broadcast");
      // console.log("tableau : ", arg.tab_res);
      // console.log("guess_word_broadcast : " + gameState + " id : ", arg.playerId);
      setGameState((gameState) =>
        gameState.map((game) =>
          game.playerId === arg.playerId
            ? {
                ...game,
                triesHistory: [
                  ...game.triesHistory,
                  {
                    result: arg.tab_res,
                    wordTried: arg.word,
                  },
                ],
              }
            : { ...game }
        )
      );
    }
    // console.log("guess_word_broadcast : " + gameState);
  });
};

export const addBrEvent = async (
  startGame:(gameBr:BrGameInfo) => void,
  socket: Socket | null,
) => {
  socket?.on("first_winning_player_br", (arg) => {

  });
  socket?.on("winning_player_br", (arg) => {

  });
  socket?.on("next_word_br", (arg) => {
    startGame(arg.data);
  });
  socket?.on("draw_br", (arg) => {

  });
};

export const lobbyOneVsOneAddEvents = (
  socket: Socket,
  toast: (options?: UseToastOptions | undefined) => ToastId | undefined,
  playerId: string,
  setHasWon: Dispatch<SetStateAction<boolean>>,
  tryHistoryP2: TriesHistory[],
  setTryHistoryP2: Dispatch<SetStateAction<TriesHistory[]>>,
  setWordP2: Dispatch<SetStateAction<string>>,
  setIsFinished: Dispatch<SetStateAction<boolean>>
) => {
  socket?.on("wining_player_1vs1", (req) => {
    setIsFinished(true);
    if (req === playerId) {
      toast({
        title: "GGEZ 😎",
        status: "success",
        isClosable: true,
        duration: 2500,
      });
      setHasWon(true);
      return;
    } else {
      toast({
        title: "Perdu ! Sadge",
        status: "error",
        isClosable: true,
        duration: 2500,
      });
      return;
    }
  });
  socket.on("draw_1vs1", () => {
    setIsFinished(true);
    toast({
      title: "Egalité.",
      status: "info",
      isClosable: true,
      duration: 2500,
    });
    return;
  });
  socket.on("guess_word_broadcast", (req) => {
    if (req.playerId !== playerId) {
      setTryHistoryP2([
        ...tryHistoryP2,
        { result: req.tab_res, wordTried: "●".repeat(req.tab_res.length) },
      ]);
    }
  });

  socket.on("update_word_broadcast", (req) => {
    if (req.playerId !== playerId) {
      setWordP2(req.array.filter((tabElt: boolean) => tabElt).map(() => "●"));
    }
  });
};

export const lobbyOneVsOneRemoveEvents = (socket: Socket) => {
  socket?.removeListener("wining_player_1vs1");
  socket?.removeListener("draw_1vs1");
  socket?.removeListener("guess_word_broadcast");
  socket?.removeListener("update_word_broadcast");
};