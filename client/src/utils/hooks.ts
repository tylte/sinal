import { Dispatch, SetStateAction, useContext } from "react";
import { Socket } from "socket.io-client";
import { DictionaryContext, PlayerContext, SocketContext } from "./context";
import { Player } from "./types";

export const useDictionary = (): Set<string> => {
  return useContext(DictionaryContext);
};

export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};

export const usePlayer = (): [
  player: Player | null,
  setPlayer: Dispatch<SetStateAction<Player | null>> | null
] => {
  return useContext(PlayerContext);
};
