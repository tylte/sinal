import axios from "axios";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { LetterResult, Player } from "./types";

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

export const addCreateLobbyEvent = (
  socket: Socket | null,
  router: NextRouter
) => {
  socket?.on("create_lobby_response", (lobbyId) => {
    console.log(lobbyId);
    router.push(`/lobby/${lobbyId}`);
  });
};
export const addJoinLobbyEvent = (socket: Socket | null) => {
  socket?.on("join_lobby_response", (arg) => {
    console.log("enter");
    if (arg.success) {
    } else {
      console.log(arg.message);
    }
  });
};

export const addCreatePlayerEvent = (
  socket: Socket | null,
  playerName: string,
  setPlayer: Dispatch<SetStateAction<Player | null>> | null,
  router: NextRouter
) => {
  socket?.on("create_player_response", (playerId: string) => {
    if (setPlayer) {
      setPlayer({ id: playerId, name: playerName });
      router.push("/lobby");
    } else {
      console.error("Couldn't create user !?");
    }
  });
};
