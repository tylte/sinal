import { useContext } from "react";
import { Socket } from "socket.io-client";
import { DictionaryContext, SocketContext } from "./context";

export const useDictionary = (): Set<string> => {
  return useContext(DictionaryContext);
};

export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};
