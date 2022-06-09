import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { Player } from "./types";

type SinalContextType = {
  // Is the user connected with websockets
  isConnected: boolean;
  // Dictionnary of possible words to try
  dictionary: Set<string>;
  // The socket connection
  socket: Socket | null;
  // Tell if the user is chatting or no
  chattingActions: [
    isChatting: boolean,
    setIsChatting: Dispatch<SetStateAction<boolean>> | null
  ];
  // The player state, null if not on multiplayer, and evolves in time
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
