import axios from "axios";
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

export const addSocketEvents = (socket: Socket | null) => {
  socket?.on("create_lobby_response", (lobbyId) => {
    
  });
}