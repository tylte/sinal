import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { Player } from "./types";

type SinalContextType = {
  isConnected: boolean;
  dictionary: Set<string>;
  socket: Socket | null;
  chattingActions: [
    isChatting: boolean,
    setIsChatting: Dispatch<SetStateAction<boolean>> | null
  ];
  playerActions: [
    player: Player | null,
    setPlayer: Dispatch<SetStateAction<Player | null>> | null
  ];
};

export const SinalContext = createContext<SinalContextType>({
  dictionary: new Set(),
  playerActions: [null, null],
  socket: null,
  isConnected: false,
  chattingActions: [false, null],
});
