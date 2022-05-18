import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import {
  LetterResult,
  Lobby,
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

      console.log("leave lobby ping", { lobbyId, changedLobby });
      setLobbies((lobbies) => {
        let newLobbies = lobbies.slice();
        if (!changedLobby) {
          newLobbies.filter((v) => v.playerList.length > 0);
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
  socket?.emit("leave_public_lobbies");
};

export const addSpecificLobbiesEvent = (
  socket: Socket | null,
  lobbyId: string,
  setLobby: Dispatch<SetStateAction<Lobby | null>>
) => {
  socket?.on(
    "lobbies_update_join",
    ({ lobby: changedLobby }: UpdateLobbyJoinPayload) => {
      if (!changedLobby) {
        return;
      }
      console.log("lobbies_update_join notif", lobbyId, changedLobby);
      if (changedLobby.id !== lobbyId) {
        return;
      }
      setLobby(changedLobby);
    }
  );

  socket?.on(
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
};
