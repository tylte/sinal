import { Dispatch, SetStateAction, useContext } from "react";
import { Socket } from "socket.io-client";
import { SinalContext } from "./context";
import { Player } from "./types";

export const useDictionary = (): Set<string> => {
  let { dictionary } = useContext(SinalContext);
  return dictionary;
};

export const useSocket = (): Socket | null => {
  let { socket } = useContext(SinalContext);
  return socket;
};

export const usePlayer = (): [
  player: Player | null,
  setPlayer: Dispatch<SetStateAction<Player | null>> | null
] => {
  let { playerActions } = useContext(SinalContext);
  return playerActions;
};

export const useConnected = (): boolean => {
  let { isConnected } = useContext(SinalContext);
  return isConnected;
};
