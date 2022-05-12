import axios from "axios";
import { NextRouter } from "next/router";
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

export const addCreateLobbyEvent = (socket: Socket | null, router : NextRouter) => {
  socket?.on("create_lobby_response", (lobbyId) => {
    router.push(`/lobby/${lobbyId}`);
  });
}