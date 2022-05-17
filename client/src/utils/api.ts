import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { LetterResult, Lobby, UpdateLobbyJoinPayload } from "./types";

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
    ({ lobbyId, playerId }: UpdateLobbyJoinPayload) => {
      console.log("lobbies_update_join notif");
      setLobbies((lobbies) => {
        let newLobbies = lobbies.map((lobby) => {
          if (lobby.id === lobbyId) {
            lobby.playerList.push({
              id: playerId,
              name: "?",
              lobbyId,
            });
            let newLobby = { ...lobby };
            return newLobby;
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
    ({ lobbyId, playerId }: UpdateLobbyJoinPayload) => {
      console.log("leave lobby ping", { lobbyId, playerId });
      setLobbies((lobbies) => {
        let newLobbies = lobbies.map((lobby) => {
          if (lobby.id === lobbyId) {
            let playerList = lobby.playerList.filter(
              (player) => player.id !== playerId
            );
            let newLobby = { ...lobby, playerList };
            return newLobby;
          } else {
            return lobby;
          }
        });
        return newLobbies.filter((v) => v.playerList.length > 0);
      });
    }
  );
};

export const addPreGameEvent = (socket : Socket | null) => {
  socket?.on(
    "starting_game", (gameId : number) => {
      console.log("starting game : " + gameId);
    }
  )
}

export const removeLobbiesEvent = (socket: Socket | null) => {
  socket?.removeListener("lobbies_update_create");
  socket?.removeListener("lobbies_update_join");
  socket?.removeListener("lobbies_update_leave");
};
