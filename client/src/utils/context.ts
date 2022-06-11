import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { ChattingActions, Player } from "./types";

type SinalContextType = {
  // Is the user connected with websockets
  isConnected: boolean;
  // Dictionnary of possible words to try
  dictionary: Set<string>;
  // The socket connection
  socket: Socket | null;
  // The option the user has for chatting or no
  chattingActions: [
    isChatting: ChattingActions,
    setIsChatting: Dispatch<SetStateAction<ChattingActions>> | null
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
  chattingActions: [
    {
      isChatting: false,
      channels: [{ id: "PUBLIC_CHAT", name: "Publique", messageHistory: [] }],
    },
    null,
  ],
});
