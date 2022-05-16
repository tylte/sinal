import axios from "axios";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { LetterResult } from "./types";

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
export const addLobbiesEvent = (socket: Socket | null) => {
  socket?.on("lobbies_update_create", (arg) => {
    console.log(arg);
  });

  socket?.on("lobbies_update_join", (arg) => {
    console.log(arg);
  });

  socket?.on("lobbies_update_leave", (arg) => {
    console.log(arg);
  });
};

export const removeLobbiesEvent = (socket: Socket | null) => {
  socket?.removeListener("lobbies_update_create");
  socket?.removeListener("lobbies_update_join");
  socket?.removeListener("lobbies_update_leave");
};
