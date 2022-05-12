import React, { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { Player } from "./types";

export const DictionaryContext = React.createContext<Set<string>>(new Set());
export const SocketContext = React.createContext<Socket | null>(null);
export const PlayerContext = React.createContext<
  [
    player: Player | null,
    setPlayer: Dispatch<SetStateAction<Player | null>> | null
  ]
>([null, null]);
